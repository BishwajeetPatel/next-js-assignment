// app/api/calls/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../lib/types'
import callsData from '../../../data/calls.json'

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Call[]>>> {
  try {
    console.log('GET /api/calls - Starting request processing')
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    
    console.log('Search params:', { search, status })
    
    let calls = callsData.calls as Call[]
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase().trim()
      calls = calls.filter(call =>
        call.prospectName?.toLowerCase().includes(searchLower) ||
        call.company?.toLowerCase().includes(searchLower) ||
        call.notes?.toLowerCase().includes(searchLower)
      )
      console.log(`Filtered by search "${search}": ${calls.length} results`)
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      calls = calls.filter(call => call.outcome === status)
      console.log(`Filtered by status "${status}": ${calls.length} results`)
    }
    
    console.log(`GET /api/calls - Returning ${calls.length} calls`)
    
    return NextResponse.json({
      data: calls,
      success: true
    })
  } catch (error) {
    console.error('Error in GET /api/calls:', error)
    return NextResponse.json({
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch calls'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Call>>> {
  try {
    console.log('POST /api/calls - Starting request processing')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate required fields
    if (!body.prospectName || !body.outcome) {
      console.log('Validation failed: Missing required fields')
      return NextResponse.json({
        data: {} as Call,
        success: false,
        error: 'Missing required fields: prospectName and outcome are required'
      }, { status: 400 })
    }
    
    // Create new call
    const newCall: Call = {
      id: `call_${Date.now()}`,
      prospectName: body.prospectName,
      company: body.company || '',
      outcome: body.outcome,
      notes: body.notes || '',
      date: body.date || new Date().toISOString().split('T')[0],
      duration: body.duration || 0
    }
    
    console.log('Created new call:', newCall)
    
    // In a real app, you would save to database here
    // For now, we'll add it to the in-memory data
    const calls = callsData.calls as Call[]
    calls.unshift(newCall)
    
    console.log('POST /api/calls - Successfully created call')
    
    return NextResponse.json({
      data: newCall,
      success: true
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/calls:', error)
    return NextResponse.json({
      data: {} as Call,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create call'
    }, { status: 500 })
  }
}