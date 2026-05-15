import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/users.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data || '[]');
    // Remove password hashes from response
    const sanitizedUsers = users.map((u: any) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, action } = body;
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/data/users.json');
    let users = [];
    if (fs.existsSync(filePath)) {
      users = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    }

    // Login action
    if (action === 'login') {
      const user = users.find((u: any) => u.email === email);
      if (!user) {
        return NextResponse.json({ error: 'Невірний email або пароль' }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Невірний email або пароль' }, { status: 401 });
      }

      // Generate JWT
      const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      cookies().set('belisi_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      const { passwordHash, ...userWithoutPassword } = user;
      return NextResponse.json({ success: true, user: userWithoutPassword });
    }

    // Register action
    if (action === 'register') {
      if (users.find((u: any) => u.email === email)) {
        return NextResponse.json({ error: 'Користувач з таким email вже існує. Будь ласка, увійдіть.' }, { status: 400 });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: 'usr-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        passwordHash: hashedPassword,
        role: 'customer',
        registeredAt: new Date().toISOString()
      };
      
      users.push(newUser);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
      
      // Generate JWT
      const token = await new SignJWT({ id: newUser.id, email: newUser.email, role: newUser.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      cookies().set('belisi_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      const { passwordHash, ...userWithoutPassword } = newUser;
      return NextResponse.json({ success: true, user: userWithoutPassword });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
