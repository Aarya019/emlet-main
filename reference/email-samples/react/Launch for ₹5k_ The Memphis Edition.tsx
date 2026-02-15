import React from 'react';
import { Container, Row, Column, Heading, Head, Body, Text, Button, Img, Link, Html, Section, Hr, Preview, Tailwind, Markdown, Font, CodeBlock } from '@react-email/components';

export default function MemphisBusinessEmail({
  firstName = 'Entrepreneur',
  ctaLink = 'https://emlet.app/launch',
  unsubscribeUrl = 'https://emlet.app/unsubscribe'
}) {
  return (
    <Html lang="en">
      <Head>
        <title>Launch for ₹5k: The Memphis Edition</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKOBj2J_0.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <style>{`
          @media (prefers-color-scheme: dark) { }
          @media (prefers-color-scheme: light) { }
          @media only screen and (max-width: 600px) {
            .mobile-image { width: 100% !important; height: auto !important; }
            .mobile-button { width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; display: block !important; text-align: center !important; }
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .stack-column { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-bottom: 20px !important; }
            .memphis-card { margin-bottom: 30px !important; }
          }
        `}</style>
      </Head>
      <Preview>Stop waiting. Start building. 4 business ideas you can launch today with less than ₹10,000.</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          
          {/* HEADER SECTION */}
          <Section style={headerSection}>
            <Row>
              <Column align="center">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  width="140"
                  alt="Emlet Logo"
                  style={logoStyle}
                />
              </Column>
            </Row>
          </Section>

          {/* HERO SECTION: ASYMMETRICAL & BOLD */}
          <Section style={heroSection} className="content-padding">
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={heroBoxStyle}>
                  <Heading1>₹5,000 IS ALL YOU NEED.</Heading1>
                  <Text style={heroSubtext}>
                    Forget the "big capital" myth. In 2026, speed beats scale. We've curated 4 high-conversion business models you can <b>Launch</b> this weekend.
                  </Text>
                  <Button href={ctaLink} style={primaryButton} className="mobile-button">
                    BUILD YOUR EMPIRE →
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* DECORATIVE DIVIDER */}
          <Section style={{ backgroundColor: '#ffffff' }}>
            <Img 
              src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-vibrant-memphis-style-decorative-divider-feat-866104.png" 
              alt="Memphis zigzag pattern"
              width="600"
              height="60"
              style={{ display: 'block', width: '100%' }}
            />
          </Section>

          {/* BUSINESS IDEAS GRID */}
          <Section style={gridSection} className="content-padding">
            <Row>
              {/* IDEA 1: DROPSHIPPING */}
              <Column className="stack-column" style={columnLeftStyle}>
                <div style={cardStylePink}>
                  <Img 
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-playful-memphis-style-illustration-digital-sh-867345.png" 
                    alt="Illustration of a digital package flying through a pink sky with geometric triangles"
                    width="260"
                    style={cardImageStyle}
                  />
                  <Text style={cardTitle}>DROPSHIPPING</Text>
                  <Text style={cardDesc}>Zero inventory. High speed. Use Emlet to build your landing page and start converting traffic in hours.</Text>
                  <Text style={cardBudget}>BUDGET: ₹5k</Text>
                </div>
              </Column>

              {/* IDEA 2: DIGITAL ASSETS */}
              <Column className="stack-column" style={columnRightStyle}>
                <div style={cardStyleBlue}>
                  <Img 
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-abstract-3d-geometric-shapes-representing-dig-867068.png" 
                    alt="Abstract 3D shapes representing digital templates and e-books on an electric blue background"
                    width="260"
                    style={cardImageStyle}
                  />
                  <Text style={cardTitle}>DIGITAL ASSETS</Text>
                  <Text style={cardDesc}>Create once, sell forever. From Notion templates to AI prompts, digital products have 99% margins.</Text>
                  <Text style={cardBudget}>BUDGET: ₹2k</Text>
                </div>
              </Column>
            </Row>

            <Row style={{ marginTop: '30px' }}>
              {/* IDEA 3: CONTENT AGENCY */}
              <Column className="stack-column" style={columnLeftStyle}>
                <div style={cardStyleGreen}>
                  <Img 
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bold-lime-green-background-covered-in-thick-b-869544.png" 
                    alt="Bold lime green background with black squiggles and a typewriter icon"
                    width="260"
                    style={cardImageStyle}
                  />
                  <Text style={cardTitle}>CONTENT STUDIO</Text>
                  <Text style={cardDesc}>Every brand needs a voice. Offer AI-assisted copywriting and social media management to local SMEs.</Text>
                  <Text style={cardBudget}>BUDGET: ₹7k</Text>
                </div>
              </Column>

              {/* IDEA 4: CUSTOM GIFTING */}
              <Column className="stack-column" style={columnRightStyle}>
                <div style={cardStyleYellow}>
                  <Img 
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bright-yellow-gift-box-with-thick-imperfect-b-869376.png" 
                    alt="A bright yellow box with thick black outlines and floating geometric confetti"
                    width="260"
                    style={cardImageStyle}
                  />
                  <Text style={cardTitle}>CURATED GIFTS</Text>
                  <Text style={cardDesc}>Personalization is the new luxury. Curate niche hampers for corporate clients and festivals.</Text>
                  <Text style={cardBudget}>BUDGET: ₹10k</Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* CALL TO ACTION: THE CONVERSION BLOCK */}
          <Section style={ctaSection} className="content-padding">
            <table width="100%" cellPadding="0" cellSpacing="0" style={ctaBox}>
              <tr>
                <td style={{ padding: '40px', textAlign: 'center' }}>
                  <Text style={ctaHeading}>READY TO CONVERT?</Text>
                  <Text style={ctaText}>
                    Don't let your ideas die in a spreadsheet. Use Emlet's visual builder to launch your professional presence in minutes.
                  </Text>
                  <Button href={ctaLink} style={secondaryButton} className="mobile-button">
                    START BUILDING NOW
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* FOOTER: HIGH CONTRAST DARK */}
          <Section style={footerSection}>
            <Row style={{ marginBottom: '30px' }}>
              <Column align="center">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/logos/favicon-new_logo_w47ybp.png"
                  width="40"
                  alt="Emlet Favicon"
                />
              </Column>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://twitter.com/emlet"><Img src="https://cdn.migma.ai/icons/fa6/FaXTwitter/ffffff.png" width="20" alt="X" /></Link>
                    </td>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://linkedin.com/company/emlet"><Img src="https://cdn.migma.ai/icons/fa6/FaLinkedin/ffffff.png" width="20" alt="LinkedIn" /></Link>
                    </td>
                    <td style={{ padding: '0 10px' }}>
                      <Link href="https://github.com/emlet"><Img src="https://cdn.migma.ai/icons/fa6/FaGithub/ffffff.png" width="20" alt="GitHub" /></Link>
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
            <Text style={footerText}>
              This email was sent to you because you're a builder. Not feeling it?{' '}
              <Link href={unsubscribeUrl} style={footerLink}>Unsubscribe here</Link>.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// --- STYLES ---

const mainStyle = {
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

const headerSection = {
  padding: '40px 0',
  backgroundColor: '#ffffff',
};

const logoStyle = {
  display: 'block',
  margin: '0 auto',
};

const heroSection = {
  padding: '0 40px 60px 40px',
  backgroundColor: '#ffffff',
};

const heroBoxStyle = {
  border: '4px solid #1a1a1a',
  padding: '40px',
  backgroundColor: '#ffff00', // Electric Yellow
  boxShadow: '12px 12px 0px #5c5cf0', // Indigo Shadow
};

const Heading1 = ({ children }) => (
  <Text style={{
    fontSize: '42px',
    lineHeight: '46px',
    fontWeight: '900',
    color: '#1a1a1a',
    margin: '0 0 20px 0',
    textAlign: 'left',
  }}>
    {children}
  </Text>
);

const heroSubtext = {
  fontSize: '18px',
  lineHeight: '26px',
  color: '#1a1a1a',
  margin: '0 0 30px 0',
};

const primaryButton = {
  backgroundColor: '#5c5cf0',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '800',
  textDecoration: 'none',
  padding: '18px 30px',
  borderRadius: '0px',
  display: 'inline-block',
  border: '3px solid #1a1a1a',
  boxShadow: '6px 6px 0px #1a1a1a',
};

const gridSection = {
  padding: '60px 40px',
  backgroundColor: '#ffffff',
};

const columnLeftStyle = { width: '50%', paddingRight: '15px', verticalAlign: 'top' };
const columnRightStyle = { width: '50%', paddingLeft: '15px', verticalAlign: 'top' };

const cardBase = {
  padding: '20px',
  border: '3px solid #1a1a1a',
  minHeight: '380px',
};

const cardStylePink = { ...cardBase, backgroundColor: '#ffccff', boxShadow: '8px 8px 0px #ff66cc' };
const cardStyleBlue = { ...cardBase, backgroundColor: '#ccffff', boxShadow: '8px 8px 0px #00ccff' };
const cardStyleGreen = { ...cardBase, backgroundColor: '#ccffcc', boxShadow: '8px 8px 0px #33ff99' };
const cardStyleYellow = { ...cardBase, backgroundColor: '#ffffcc', boxShadow: '8px 8px 0px #ffff00' };

const cardImageStyle = {
  display: 'block',
  width: '100%',
  height: 'auto',
  border: '2px solid #1a1a1a',
  marginBottom: '15px',
};

const cardTitle = {
  fontSize: '20px',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 10px 0',
};

const cardDesc = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#1a1a1a',
  margin: '0 0 15px 0',
};

const cardBudget = {
  fontSize: '14px',
  fontWeight: '800',
  color: '#5c5cf0',
  margin: '0',
};

const ctaSection = {
  padding: '40px',
  backgroundColor: '#ffffff',
};

const ctaBox = {
  backgroundColor: '#33ff99', // Lime Green
  border: '4px solid #1a1a1a',
  boxShadow: '15px 15px 0px #ff66cc',
};

const ctaHeading = {
  fontSize: '32px',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 15px 0',
};

const ctaText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a1a',
  margin: '0 0 25px 0',
};

const secondaryButton = {
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '800',
  textDecoration: 'none',
  padding: '18px 30px',
  borderRadius: '0px',
  display: 'inline-block',
  border: '3px solid #ffffff',
};

const footerSection = {
  backgroundColor: '#0a0a0a',
  padding: '60px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#9ca3af',
  margin: '0 0 10px 0',
};

const footerLink = {
  color: '#ffffff',
  textDecoration: 'underline',
};
