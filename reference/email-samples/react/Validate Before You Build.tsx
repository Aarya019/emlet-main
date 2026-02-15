import React from 'react';
import { Container, Row, Column, Heading, Head, Body, Text, Button, Img, Link, Html, Section, Hr, Preview, Tailwind, Markdown, Font, CodeBlock } from '@react-email/components';

export default function IdeaValidationEmail({
  firstName = 'Builder',
  ctaLink = 'https://emlet.app/launch',
  unsubscribeUrl = 'https://emlet.app/unsubscribe'
}) {
  return (
    <Html lang="en">
      <Head>
        <title>Validate Before You Build</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCOjGVtW34dUQC8QNcyuxbWBW8.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcC7jGVtW34dUQC8QNcyuxbWBW8.woff2',
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
            .bauhaus-grid { padding: 20px !important; }
          }
        `}</style>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>
        Stop building in the dark. Use the 5 PM Framework and Lean Validation to prove your SaaS idea will convert before you launch.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* HEADER - PURE WHITE */}
          <Section style={headerSection}>
            <Row>
              <Column align="left">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  width="100"
                  alt="Emlet Logo"
                  style={logoStyle}
                />
              </Column>
            </Row>
          </Section>

          {/* HERO - BAUHAUS ASYMMETRY */}
          <Section style={heroSection} className="content-padding">
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
                  <div style={redSquare}></div>
                  <Text style={heroTitle}>
                    VALIDATE.<br />
                    PROVE.<br />
                    BUILD.
                  </Text>
                  <Text style={heroSubtext}>
                    34% of startups fail due to lack of Product-Market Fit. Don't be a statistic. 
                    Convert your assumptions into evidence with a rigid validation framework.
                  </Text>
                </td>
                <td style={{ width: '120px', verticalAlign: 'top' }} className="desktop-only">
                  <div style={yellowCircle}></div>
                  <div style={blueTriangle}></div>
                </td>
              </tr>
            </table>
          </Section>

          {/* SECTION 1: THE 5 PM FRAMEWORK */}
          <Section style={whiteSection} className="content-padding">
            <Text style={sectionLabel}>01 / STRATEGY</Text>
            <Text style={headingStyle}>The 5 PM Framework</Text>
            <Hr style={bauhausDivider} />
            
            {[
              { t: 'PROBLEM', d: 'Is the hurdle relevant to your target market? Does it warrant a solution?', c: '#ff4d4d' },
              { t: 'PURCHASER', d: 'Identify the ideal profile. Where do they hang out online?', c: '#1a1a1a' },
              { t: 'PRICING', d: 'Usage-based or subscription? Test perceived value early.', c: '#5c5cf0' },
              { t: 'MARKET', d: 'Analyze competitors. Find your unfair advantage.', c: '#ffcc00' }
            ].map((item, i) => (
              <table key={i} width="100%" style={{ marginBottom: '16px', borderLeft: `8px solid ${item.c}` }}>
                <tr>
                  <td style={{ padding: '12px 20px' }}>
                    <Text style={pillTitle}>{item.t}</Text>
                    <Text style={pillText}>{item.d}</Text>
                  </td>
                </tr>
              </table>
            ))}
          </Section>

          {/* SECTION 2: LEAN EXPERIMENTATION (ZIGZAG) */}
          <Section style={graySection} className="content-padding">
            <Text style={sectionLabel}>02 / EXECUTION</Text>
            <Text style={headingStyle}>Lean Experimentation</Text>
            
            {/* Step 1 */}
            <Row style={{ marginTop: '40px' }}>
              <Column className="stack-column" style={{ width: '50%', paddingRight: '20px' }}>
                <Img 
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bauhaus-style-artistic-composition-representi-075677.png" 
                  alt="Abstract geometric representation of customer interviews using squares and circles"
                  width="280"
                  height="280"
                  style={bauhausImage}
                />
              </Column>
              <Column className="stack-column" style={{ width: '50%', verticalAlign: 'middle' }}>
                <Text style={stepNumber}>01</Text>
                <Text style={stepTitle}>The Mom Test</Text>
                <Text style={stepDescription}>
                  Talk about their life, not your idea. Ask about specific past behaviors rather than future opinions. 
                  Listen 80% of the time.
                </Text>
              </Column>
            </Row>

            {/* Step 2 */}
            <table width="100%" cellPadding="0" cellSpacing="0" dir="rtl" style={{ marginTop: '60px' }}>
              <tr>
                <td className="stack-column" style={{ width: '50%', paddingLeft: '20px' }}>
                  <Img 
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bold-bauhaus-graphic-representing-financial-c-077738.png" 
                    alt="Bold blue triangle and yellow circle representing financial commitment and pre-sales"
                    width="280"
                    height="280"
                    style={bauhausImage}
                  />
                </td>
                <td className="stack-column" dir="ltr" style={{ width: '50%', verticalAlign: 'middle', paddingRight: '20px' }}>
                  <Text style={stepNumber}>02</Text>
                  <Text style={stepTitle}>Pre-Sales & Waitlists</Text>
                  <Text style={stepDescription}>
                    Money is the ultimate validator. A landing page with a "Buy Now" button that leads to a waitlist 
                    measures true intent, not just politeness.
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* CTA SECTION */}
          <Section style={ctaSection} className="content-padding">
            <div style={blueSquare}></div>
            <Text style={ctaHeading}>READY TO CONVERT?</Text>
            <Text style={ctaText}>
              Launch your validation landing page in minutes with Emlet's high-performance builder. 
              Stop guessing. Start building with data.
            </Text>
            <Button href={ctaLink} style={primaryButton} className="mobile-button">
              BUILD YOUR MVP NOW
            </Button>
          </Section>

          {/* FOOTER - DARK THEME */}
          <Section style={footerSection}>
            <Container style={{ padding: '40px 20px' }}>
              <Row style={{ marginBottom: '24px' }}>
                <Column align="center">
                  <Img
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                    width="80"
                    alt="Emlet Logo White"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Column>
              </Row>
              <Row style={{ marginBottom: '24px' }}>
                <Column align="center">
                  <table cellPadding="0" cellSpacing="0" align="center">
                    <tr>
                      <td style={{ padding: '0 10px' }}>
                        <Link href="https://twitter.com/emlet">
                          <Img src="https://cdn.migma.ai/icons/fa6/FaXTwitter/ffffff.png" width="20" alt="X" />
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
                © 2026 Emlet Technologies Inc. All rights reserved.<br />
                Create, curate, and send AI-assisted newsletters with ease.
              </Text>
              <Text style={footerText}>
                This email was sent to you by Emlet. You can <Link href={unsubscribeUrl} style={footerLink}>unsubscribe here</Link>.
              </Text>
            </Container>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// STYLES
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const headerSection = {
  padding: '40px 20px',
  backgroundColor: '#ffffff',
};

const logoStyle = {
  display: 'block',
};

const heroSection = {
  padding: '40px 40px 80px 40px',
  backgroundColor: '#ffffff',
};

const redSquare = {
  width: '40px',
  height: '40px',
  backgroundColor: '#ff4d4d',
  marginBottom: '20px',
};

const yellowCircle = {
  width: '80px',
  height: '80px',
  backgroundColor: '#ffcc00',
  borderRadius: '50%',
  marginBottom: '20px',
};

const blueTriangle = {
  width: '0',
  height: '0',
  borderLeft: '40px solid transparent',
  borderRight: '40px solid transparent',
  borderBottom: '70px solid #5c5cf0',
};

const heroTitle = {
  fontSize: '64px',
  lineHeight: '1',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 24px 0',
  letterSpacing: '-2px',
};

const heroSubtext = {
  fontSize: '18px',
  lineHeight: '1.4',
  color: '#1a1a1a',
  margin: '0',
  maxWidth: '400px',
};

const whiteSection = {
  padding: '60px 40px',
  backgroundColor: '#ffffff',
};

const graySection = {
  padding: '60px 40px',
  backgroundColor: '#f8f9fa',
};

const sectionLabel = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#1a1a1a',
  letterSpacing: '2px',
  margin: '0 0 8px 0',
};

const headingStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 20px 0',
};

const bauhausDivider = {
  border: 'none',
  borderTop: '4px solid #1a1a1a',
  margin: '0 0 40px 0',
  width: '100px',
};

const pillTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 4px 0',
};

const pillText = {
  fontSize: '15px',
  lineHeight: '1.5',
  color: '#4b5563',
  margin: '0',
};

const bauhausImage = {
  display: 'block',
  borderRadius: '0',
  border: '4px solid #1a1a1a',
};

const stepNumber = {
  fontSize: '48px',
  fontWeight: '900',
  color: '#d1d5db',
  lineHeight: '1',
  margin: '0 0 10px 0',
};

const stepTitle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 12px 0',
};

const stepDescription = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#1a1a1a',
  margin: '0',
};

const ctaSection = {
  padding: '80px 40px',
  backgroundColor: '#ffffff',
  textAlign: 'center' as const,
};

const blueSquare = {
  width: '60px',
  height: '60px',
  backgroundColor: '#5c5cf0',
  margin: '0 auto 30px auto',
};

const ctaHeading = {
  fontSize: '40px',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 16px 0',
};

const ctaText = {
  fontSize: '18px',
  lineHeight: '1.5',
  color: '#1a1a1a',
  margin: '0 0 40px 0',
};

const primaryButton = {
  backgroundColor: '#5c5cf0',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  padding: '20px 40px',
  borderRadius: '8px',
  display: 'inline-block',
  border: 'none',
};

const footerSection = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
};

const footerLink = {
  color: '#ffffff',
  textDecoration: 'underline',
};
