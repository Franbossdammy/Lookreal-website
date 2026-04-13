import { NextRequest, NextResponse } from 'next/server'

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, whatsapp, instagram, tiktok, cityState, creatorType, contentNiche, usedBefore, hearAbout } = body

    console.log('\n─── /api/interest ───')
    console.log('SCRIPT_URL set?', !!SCRIPT_URL)
    console.log('Received:', { fullName, email, whatsapp })

    if (!fullName || !email || !whatsapp || !instagram || !tiktok || !cityState || !creatorType || !contentNiche || !usedBefore) {
      console.log('Validation failed — missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!SCRIPT_URL) {
      console.log('⚠️  GOOGLE_SCRIPT_URL not set')
      return NextResponse.json({ success: true, dev: true })
    }

    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })

    /*
     * Column order matches the Interest tab exactly (columns B onwards):
     * B: Full Name
     * C: Email Address
     * D: TikTok Handle
     * E: Instagram Handle
     * F: Content Lane  (we map contentNiche here)
     * G: Service Category (we map creatorType here)
     * H: City / Area (Lagos)
     * I: Sponsored?  (we map usedBefore here)
     * J: WhatsApp
     * K: How Did You Hear?
     * L: Date Registered
     */
    const payload = {
      tab: 'Interest',
      values: [
        fullName,
        email,
        tiktok,
        instagram,
        contentNiche,
        creatorType,
        cityState,
        usedBefore,
        whatsapp,
        hearAbout || '',
        timestamp,
      ],
    }

    console.log('Sending to GAS tab:', payload.tab, '| values count:', payload.values.length)

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })

    const responseText = await res.text()
    console.log('GAS status:', res.status, '| body:', responseText.slice(0, 120))

    // GAS sometimes returns an HTML page even on success — treat status 200 as success
    if (!res.ok) throw new Error(`GAS ${res.status}: ${responseText}`)

    // If GAS returned our JSON, great. If it returned HTML (known GAS quirk), still treat as success.
    const didError = responseText.includes('"error"') && !responseText.includes('<html')
    if (didError) throw new Error(`GAS script error: ${responseText}`)

    console.log('✅ Interest row written')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ /api/interest error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
