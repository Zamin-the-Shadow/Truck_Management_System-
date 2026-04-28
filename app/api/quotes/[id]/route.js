import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quote from '@/models/Quote';
import { getSession } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    params = await params;
    const { id } = params;
    const session = await getSession();
    if (!session || session.role !== 'company') {
      // Only companies can accept/reject quotes for their loads
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.companyId.toString() !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (['accepted', 'rejected'].includes(body.status)) {
      quote.status = body.status;
      await quote.save();
    } else {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    return NextResponse.json({ message: `Quote ${body.status} successfully`, quote }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    params = await params;
    const { id } = params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    await Quote.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Quote deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
