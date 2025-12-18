import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Try to query users (will be empty initially)
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
