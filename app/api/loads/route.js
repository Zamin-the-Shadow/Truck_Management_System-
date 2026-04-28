import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Load from '@/models/Load';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    let query = {};
    if (session.role === 'company') {
      query.companyId = session.id;
    } else if (session.role === 'driver') {
      // Drivers see loads assigned to them, or maybe all pending?
      // For this app: Drivers see loads assigned to them or unassigned/pending loads if requested
      // For simplicity, let's return assigned + pending loads for them, or just let them query
      const url = new URL(req.url);
      const filter = url.searchParams.get('filter');
      
      if (filter === 'my-loads') {
        query.driverId = session.id;
      } else {
        query.status = 'pending'; // Drivers can see available loads to quote on
      }
    }
    // Admin sees all without filter
    
    // Support sorting
    const loads = await Load.find(query).sort({ createdAt: -1 }).populate('driverId', 'name email phone').populate('companyId', 'name companyName email');
    return NextResponse.json({ loads }, { status: 200 });
  } catch (error) {
    console.error('Loads GET error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'company') {
      return NextResponse.json({ error: 'Unauthorized, only companies can request loads' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    const newLoad = await Load.create({
      ...body,
      companyId: session.id,
      status: 'pending'
    });

    return NextResponse.json({ message: 'Load created successfully', load: newLoad }, { status: 201 });
  } catch (error) {
    console.error('Loads POST error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
