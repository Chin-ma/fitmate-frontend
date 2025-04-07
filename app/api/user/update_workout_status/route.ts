import { NextRequest, NextResponse } from 'next/server';

// In a real implementation, you would save this data to a database
const workoutLogs: { 
  date: string; 
  completed: boolean; 
  notes: string;
}[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, completed, notes } = body;
    
    if (date === undefined || completed === undefined) {
      return NextResponse.json(
        { error: 'Date and completed status are required' },
        { status: 400 }
      );
    }
    
    // Save workout status (in a real app, this would go to a database)
    const workoutLog = { date, completed, notes: notes || '' };
    
    // Find if an entry for this date already exists
    const existingIndex = workoutLogs.findIndex(log => log.date === date);
    
    if (existingIndex >= 0) {
      // Update existing entry
      workoutLogs[existingIndex] = workoutLog;
    } else {
      // Add new entry
      workoutLogs.push(workoutLog);
    }
    
    // Sort by date (newest first)
    workoutLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log('Updated workout logs:', workoutLogs);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Workout status updated successfully',
      logs: workoutLogs
    });
  } catch (error) {
    console.error('Error updating workout status:', error);
    return NextResponse.json(
      { error: 'Failed to update workout status' },
      { status: 500 }
    );
  }
} 