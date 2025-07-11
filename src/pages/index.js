import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke halaman login D'ONE setelah 3 detik
    const timer = setTimeout(() => {
      router.push('/Login/hal-login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Head>
        <title>D&#39;ONE - Digital One Systems by Bank Indonesia</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="lp-root">
        {/* Background Image */}
        <div className="lp-bgimg" />
        {/* Overlay */}
        <div className="lp-overlay" />
        {/* Center Card */}
        <div className="lp-card">
          <Image src="/assets/D'ONE.png" alt="D'ONE Logo" width={150} height={90} priority />
          <h1>
            <span className="lp-welcome">Selamat Datang di</span><br />
            <span className="lp-brand">D&#39;ONE</span>
          </h1>
          <p className="lp-desc">
            Digital One Order by Bank Indonesia
          </p>
        </div>
      </div>
      <style jsx>{`
        .lp-root {
          min-height: 100vh;
          width: 100vw;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .lp-bgimg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: url('/assets/bankindonesia.png') center center/cover no-repeat;
          filter: blur(6px) brightness(0.77) saturate(1.07);
          z-index: 0;
        }
        .lp-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(235, 241, 255, 0.43);
          z-index: 1;
        }
        .lp-card {
          position: relative;
          z-index: 3;
          text-align: center;
          background: rgba(255,255,255,0.98);
          border-radius: 22px;
          padding: 54px 40px 42px 40px;
          box-shadow: 0 8px 38px 0 rgba(70,90,150,0.14), 0 1.5px 6px 0 rgba(70,90,150,0.04);
          animation: popin 1.1s cubic-bezier(.39,1.53,.56,.91);
          transition: box-shadow .3s;
        }
        .lp-card img {
          margin-bottom: 16px;
        }
        .lp-welcome {
          color: #465a96;
          font-weight: 600;
          font-size: 1.6rem;
          letter-spacing: 0.02em;
          display: inline-block;
        }
        .lp-brand {
          color: #2F4D8E;
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.05;
        }
        .lp-desc {
          margin-top: 18px;
          color: #516EB3;
          font-weight: 500;
          font-size: 1rem;
          letter-spacing: 0.03em;
          opacity: 0.85;
        }
        @keyframes popin {
          0% { opacity:0; transform: scale(0.8) translateY(60px);}
          60% { opacity:1; transform: scale(1.04) translateY(-16px);}
          90% { transform: scale(0.97) translateY(6px);}
          100% { opacity:1; transform: scale(1) translateY(0);}
        }
        @media (max-width: 600px) {
          .lp-card {
            padding: 32px 6vw 24px 6vw;
            border-radius: 14px;
          }
          .lp-welcome { font-size: 1.14rem;}
          .lp-brand { font-size: 1.44rem;}
        }
      `}</style>
    </>
  )
}