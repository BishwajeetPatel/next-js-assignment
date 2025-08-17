// app/api/calls/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../../lib/types'
import callsData from '../../../../data/calls.json'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Call | null>>> {
  try {
    // Await the params as required by Next.js 15
    const { id } = await context.params
    console.log('GET /api/calls/[id] - Fetching call with id:', id)
    
    const calls = callsData.calls as Call[]
    const call = calls.find(c => c.id === id)
    
    if (!call) {
      console.log('Call not found for id:', id)
      return NextResponse.json({
        data: null,
        success: false,
        error: 'Call not found'
      }, { status: 404 })
    }
    
    console.log('Call found:', call)
    return NextResponse.json({
      data: call,
      success: true
    })
  } catch (error) {
    console.error('Error fetching call:', error)
    return NextResponse.json({
      data: null,
      success: false,
      error: 'Failed to fetch call'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Call | null>>> {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    console.log('PUT /api/calls/[id] - Updating call:', { id, body })
    
    const calls = callsData.calls as Call[]
    const callIndex = calls.findIndex(c => c.id === id)
    
    if (callIndex === -1) {
      console.log('Call not found for update:', id)
      return NextResponse.json({
        data: null,
        success: false,
        error: 'Call not found'
      }, { status: 404 })
    }
    
    // Update the call (in a real app, this would update the database)
    const updatedCall = { ...calls[callIndex], ...body, id } // Preserve the ID
    calls[callIndex] = updatedCall
    
    console.log('Call updated:', updatedCall)
    return NextResponse.json({
      data: updatedCall,
      success: true
    })
  } catch (error) {
    console.error('Error updating call:', error)
    return NextResponse.json({
      data: null,
      success: false,
      error: 'Failed to update call'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Call | null>>> {
  try {
    const { id } = await context.params
    console.log('DELETE /api/calls/[id] - Deleting call:', id)
    
    const calls = callsData.calls as Call[]
    const callIndex = calls.findIndex(c => c.id === id)
    
    if (callIndex === -1) {
      console.log('Call not found for deletion:', id)
      return NextResponse.json({
        data: null,
        success: false,
        error: 'Call not found'
      }, { status: 404 })
    }
    
    // Remove the call (in a real app, this would delete from database)
    const deletedCall = calls.splice(callIndex, 1)[0]
    
    console.log('Call deleted:', deletedCall)
    return NextResponse.json({
      data: deletedCall,
      success: true
    })
  } catch (error) {
    console.error('Error deleting call:', error)
    return NextResponse.json({
      data: null,
      success: false,
      error: 'Failed to delete call'
    }, { status: 500 })
  }
}