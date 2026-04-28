import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { name, email, password, role, companyName, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    // Determine default role just in case
    const userRole = ['admin', 'driver', 'company'].includes(role) ? role : 'company';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      companyName,
      phone,
    });

    // Don't send password back
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ message: 'User registered successfully', user: userObj }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
