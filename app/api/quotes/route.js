import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Quote from '@/models/Quote';
import Load from '@/models/Load';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const url = new URL(req.url);
    const loadId = url.searchParams.get('loadId');
    
    let query = {};
    if (loadId) query.loadId = loadId;
    
    if (session.role === 'company') {
      // Companies only see quotes for their own loads
      query.companyId = session.id;
    }

    const quotes = await Quote.find(query).sort({ createdAt: -1 }).populate('loadId');
    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      // In this system, maybe Admins submit quotes to Companies on behalf of drivers?
      // Or maybe companies request quotes from Admin?
      // "Companies/Users.. Get quote functionality"
      // Let's say Companies submit a Load request, and Admin gives a quote for the Load.
      // So Admin POSTs a quote.
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    const load = await Load.findById(body.loadId);
    if (!load) {
      return NextResponse.json({ error: 'Load not found' }, { status: 404 });
    }

    const newQuote = await Quote.create({
      loadId: load._id,
      companyId: load.companyId,
      proposedPrice: body.proposedPrice,
      message: body.message,
      status: 'pending'
    });

    return NextResponse.json({ message: 'Quote created successfully', quote: newQuote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
