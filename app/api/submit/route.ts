import { NextRequest, NextResponse } from 'next/server'

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const get = (key: string) => (data.get(key) as string) ?? ''

    const fullName        = get('fullName')
    const email           = get('email')
    const tiktok          = get('tiktok')
    const instagram       = get('instagram')
    const tiktokLink      = get('tiktokLink')
    const igLink          = get('igLink')
    const contentLane     = get('contentLane')
    const serviceCategory = get('serviceCategory')
    const cityLagos       = get('cityLagos')
    const sponsored       = get('sponsored')
    const story           = get('story')
    const consent1        = get('consent1')
    const consent2        = get('consent2')
    const consent3        = get('consent3')

    console.log('\n─── /api/submit ───')
    console.log('SCRIPT_URL set?', !!SCRIPT_URL)
    console.log('Received:', { fullName, email })

    if (!fullName || !email || !tiktok || !instagram || !tiktokLink || !igLink || !contentLane || !serviceCategory || !cityLagos || !sponsored || !story || consent1 !== 'true' || consent2 !== 'true') {
      console.log('Validation failed — missing fields or consent')
      return NextResponse.json({ error: 'Missing required fields or consent' }, { status: 400 })
    }

    if (!SCRIPT_URL) {
      console.log('⚠️  GOOGLE_SCRIPT_URL not set')
      return NextResponse.json({ success: true, dev: true })
    }

    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos' })

    /*
     * Column order matches the Submissions tab exactly (columns B → P):
     * B: Full Name
     * C: Email Address
     * D: TikTok Handle
     * E: Instagram Handle
     * F: TikTok Video URL
     * G: Instagram Reel URL
     * H: Content Lane
     * I: Service Category
     * J: City / Area (Lagos)
     * K: Sponsored Spot?
     * L: Creator's Story
     * M: App Featured?      ← consent1
     * N: Rights Granted?    ← consent1
     * O: Age 18+ Confirmed? ← consent2
     * P: Date Submitted
     */
    const payload = {
      tab: '📝 Submissions',
      values: [
        fullName,
        email,
        tiktok,
        instagram,
        tiktokLink,
        igLink,
        contentLane,
        serviceCategory,
        cityLagos,
        sponsored === 'yes' ? 'Yes' : 'No',
        story,
        'Yes',  // App Featured (consent1)
        'Yes',  // Rights Granted (consent1)
        'Yes',  // Age 18+ (consent2)
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

    if (!res.ok) throw new Error(`GAS ${res.status}: ${responseText}`)

    const didError = responseText.includes('"error"') && !responseText.includes('<html')
    if (didError) throw new Error(`GAS script error: ${responseText}`)

    console.log('✅ Submission row written')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ /api/submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
