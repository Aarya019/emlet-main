import React from 'react';
import { Container, Row, Column, Heading, Head, Body, Text, Button, Img, Link, Html, Section, Hr, Preview, Tailwind, Markdown, Font, CodeBlock } from '@react-email/components';

export default function StartupLessonsEmail({
  firstName = 'Founder',
  ctaLink = 'https://emlet.app/features',
  unsubscribeUrl = 'https://emlet.app/unsubscribe'
}) {
  return (
    <Html lang="en">
      <Head>
        <title>POW! Don't Let Your Startup Go Boom 💥</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <style>{`
          @media (prefers-color-scheme: dark) {}
          @media (prefers-color-scheme: light) {}
          @media only screen and (max-width: 600px) {
            .mobile-image { width: 100% !important; height: auto !important; }
            .mobile-button { max-width: 100% !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; display: block !important; text-align: center !important; }
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .stack-column { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-bottom: 20px !important; }
            .hide-mobile { display: none !important; }
          }
          .pop-border { border: 4px solid #000000 !important; }
          .halftone { background-image: radial-gradient(#000 10%, transparent 10%); background-size: 10px 10px; }
        `}</style>
      </Head>
      <Preview>80% of startup failures stem from poor systems, not lack of effort. Build better with Emlet.</Preview>
      <Body style={mainBody}>
        <Container style={containerStyle}>
          
          {/* HEADER SECTION */}
          <Section style={{ backgroundColor: '#ffffff', padding: '24px 40px' }} className="content-padding">
            <Row>
              <Column align="left">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  width="100"
                  alt="Emlet Logo"
                  style={{ display: 'block' }}
                />
              </Column>
              <Column align="right" className="hide-mobile">
                <Text style={{ fontSize: '12px', fontWeight: '700', color: '#000000', margin: 0 }}>
                  ISSUE #042 • FEB 2026
                </Text>
              </Column>
            </Row>
          </Section>

          {/* HERO SECTION: POP ART IMPACT */}
          <Section style={{ backgroundColor: '#FFD700', padding: '40px', borderTop: '4px solid #000000', borderBottom: '4px solid #000000' }} className="content-padding">
            <Row>
              <Column>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td style={{ backgroundColor: '#FF4500', padding: '10px 20px', border: '4px solid #000000', display: 'inline-block', transform: 'rotate(-2deg)' }}>
                      <Text style={{ color: '#ffffff', fontSize: '42px', fontWeight: '900', margin: 0, lineHeight: '1' }}>
                        KABOOM!
                      </Text>
                    </td>
                  </tr>
                </table>
                <Heading as="h1" style={heroHeading}>
                  WHY STARTUPS <br /> CRASH & BURN
                </Heading>
                <Text style={heroSubtext}>
                  New data from 2025 post-mortems reveals a shocking truth: <b>80% of failures</b> are caused by broken systems, not a lack of willpower.
                </Text>
                <Button href={ctaLink} style={primaryButton} className="mobile-button">
                  BUILD BETTER SYSTEMS NOW
                </Button>
              </Column>
            </Row>
          </Section>

          {/* LESSON 1: THE SYSTEM TRAP */}
          <Section style={{ backgroundColor: '#ffffff', padding: '60px 40px' }} className="content-padding">
            <Row>
              <Column className="stack-column" style={{ width: '50%', verticalAlign: 'middle', paddingRight: '20px' }}>
                <div style={{ border: '4px solid #000000', padding: '20px', backgroundColor: '#5c5cf0' }}>
                  <Img
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-pop-art-style-illustration-in-comic-book-aest-987339.png"
                    alt="Comic style illustration of a gear crushing a muscle arm, representing systems over willpower"
                    width="240"
                    height="240"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </Column>
              <Column className="stack-column" style={{ width: '50%', verticalAlign: 'middle' }}>
                <Text style={tagStyle}>LESSON #1</Text>
                <Heading as="h2" style={sectionHeading}>Systems Over Willpower</Heading>
                <Text style={bodyText}>
                  Leaders often mistake discipline for motivation. Failed startups in 2024 relied on "hustle" while their manual processes created <b>cache drift</b> and <b>security leaks</b>. 
                </Text>
                <Text style={bodyText}>
                  <b>The Fix:</b> Automate the repetitive. Emlet’s drag-and-drop components ensure your newsletters run on a repeatable, error-free engine.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* LESSON 2: THE TECH DEBT GHOST */}
          <Section style={{ backgroundColor: '#00BFFF', padding: '60px 40px', borderTop: '4px solid #000000' }} className="content-padding">
            <table width="100%" dir="rtl">
              <tr>
                <td className="stack-column" style={{ width: '50%', paddingLeft: '20px' }} dir="ltr">
                   <div style={{ border: '4px solid #000000', padding: '20px', backgroundColor: '#ffffff' }}>
                    <Img
                      src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-pop-art-comic-book-graphic-featuring-spooky-s-986747.png"
                      alt="Halftone pattern background with a ghost icon representing technical debt haunting a server"
                      width="240"
                      height="240"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </td>
                <td className="stack-column" style={{ width: '50%' }} dir="ltr">
                  <Text style={{ ...tagStyle, backgroundColor: '#FF4500' }}>LESSON #2</Text>
                  <Heading as="h2" style={sectionHeading}>The Cost of Cutting Corners</Heading>
                  <Text style={bodyText}>
                    Rushed migrations (like the 2025 Azure CDN shutdown) forced teams into manual invalidations and inconsistent rule deployments. 
                  </Text>
                  <Text style={bodyText}>
                    <b>The Fix:</b> Use tools that enforce standards. Emlet uses email-safe fonts and responsive logic out of the box so you never "drift" from quality.
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* CTA SECTION: SPEECH BUBBLE STYLE */}
          <Section style={{ backgroundColor: '#ffffff', padding: '80px 40px' }} className="content-padding">
            <table width="100%" style={{ border: '4px solid #000000', backgroundColor: '#FFD700' }}>
              <tr>
                <td style={{ padding: '40px', textAlign: 'center' }}>
                  <Heading as="h2" style={{ ...sectionHeading, fontSize: '32px', marginBottom: '10px' }}>
                    READY TO LAUNCH?
                  </Heading>
                  <Text style={{ ...bodyText, fontWeight: '700', fontSize: '18px' }}>
                    Don't be a statistic. Build your high-performance newsletter in minutes.
                  </Text>
                  <Button href={ctaLink} style={{ ...primaryButton, marginTop: '20px', width: '250px' }} className="mobile-button">
                    CONVERT NOW
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* FOOTER */}
          <Section style={{ backgroundColor: '#0a0a0a', padding: '60px 40px' }} className="content-padding">
            <Row style={{ marginBottom: '30px' }}>
              <Column align="center">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  width="80"
                  alt="Emlet Logo White"
                  style={{ display: 'block', filter: 'brightness(0) invert(1)' }}
                />
              </Column>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://twitter.com/emlet">
                        <Img src="https://cdn.migma.ai/icons/fa6/FaXTwitter/ffffff.png" width="20" alt="Twitter" />
                      </Link>
                    </td>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://linkedin.com/company/emlet">
                        <Img src="https://cdn.migma.ai/icons/fa6/FaLinkedin/ffffff.png" width="20" alt="LinkedIn" />
                      </Link>
                    </td>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://github.com/emlet">
                        <Img src="https://cdn.migma.ai/icons/fa6/FaGithub/ffffff.png" width="20" alt="GitHub" />
                      </Link>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
            <Text style={footerText}>
              © 2026 Emlet Technologies Inc. All rights reserved.
            </Text>
            <Text style={footerText}>
              Create, curate, and send AI-assisted newsletters with ease.
            </Text>
            <Text style={{ ...footerText, marginTop: '20px' }}>
              This email was sent to you by Emlet. You can{' '}
              <Link href={unsubscribeUrl} style={{ color: '#ffffff', textDecoration: 'underline' }}>
                unsubscribe here
              </Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const mainBody = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const heroHeading = {
  fontSize: '56px',
  lineHeight: '0.9',
  fontWeight: '900',
  color: '#000000',
  margin: '20px 0',
  textAlign: 'left' as const,
};

const heroSubtext = {
  fontSize: '20px',
  lineHeight: '1.4',
  color: '#000000',
  margin: '0 0 30px 0',
  fontWeight: '500',
};

const sectionHeading = {
  fontSize: '28px',
  lineHeight: '1.1',
  fontWeight: '900',
  color: '#000000',
  margin: '10px 0 20px 0',
};

const bodyText = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#1a1a1a',
  margin: '0 0 16px 0',
};

const tagStyle = {
  display: 'inline-block',
  backgroundColor: '#5c5cf0',
  color: '#ffffff',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: '900',
  border: '2px solid #000000',
  margin: '0',
};

const primaryButton = {
  backgroundColor: '#5c5cf0',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '900',
  textDecoration: 'none',
  padding: '18px 30px',
  borderRadius: '8px',
  display: 'inline-block',
  border: '4px solid #000000',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '4px 0',
};
