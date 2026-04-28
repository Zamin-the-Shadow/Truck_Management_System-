import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Load from '@/models/Load';
import { getSession } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    params = await params;
    const { id } = params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    
    const load = await Load.findById(id);
    if (!load) {
      return NextResponse.json({ error: 'Load not found' }, { status: 404 });
    }

    // Role checks
    if (session.role === 'driver') {
      if (load.driverId?.toString() !== session.id) {
        return NextResponse.json({ error: 'Unauthorized, load not assigned to you' }, { status: 403 });
      }
      // Drivers can only update status
      const allowedStatuses = ['picked', 'in_transit', 'delivered'];
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
      }
      load.status = body.status;
    } else if (session.role === 'admin') {
      // Admin can update anything, primarily assignment
      if (body.driverId) load.driverId = body.driverId;
      if (body.status) load.status = body.status;
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await load.save();
    return NextResponse.json({ message: 'Load updated successfully', load }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    params = await params;
    const { id } = params;
    const session = await getSession();
    if (!session || (session.role !== 'admin' && session.role !== 'company')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    await Load.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Load deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
