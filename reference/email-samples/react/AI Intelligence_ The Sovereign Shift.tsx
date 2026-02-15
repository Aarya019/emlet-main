import React from 'react';
import { Container, Row, Column, Heading, Head, Body, Text, Button, Img, Link, Html, Section, Hr, Preview, Tailwind, Markdown, Font, CodeBlock } from '@react-email/components';

export default function EmletAINewsEmail({
  firstName = 'Innovator',
  ctaLink = 'https://emlet.app/features',
  unsubscribeUrl = 'https://emlet.app/unsubscribe',
}) {
  return (
    <Html lang="en">
      <Head>
        <title>AI Intelligence: The Sovereign Shift</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
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
            .mobile-button { width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; display: block !important; text-align: center !important; }
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .stack-column { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-bottom: 20px !important; }
            .brutalist-card { margin-bottom: 30px !important; }
          }
        `}</style>
      </Head>
      <Preview>Sovereign AI: Canada and Germany launch a new tech alliance to reduce global dependencies. Build your own AI-powered news today.</Preview>
      <Body style={mainBody}>
        <Container style={container}>
          
          {/* HEADER SECTION */}
          <Section style={headerSection}>
            <Row>
              <Column align="center">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  width="120"
                  alt="Emlet Logo"
                  style={logoStyle}
                />
              </Column>
            </Row>
          </Section>

          {/* HERO SECTION */}
          <Section style={heroSection} className="content-padding">
            <table width="100%" cellPadding="0" cellSpacing="0" style={brutalistHeroCard}>
              <tr>
                <td style={{ padding: '40px' }}>
                  <Text style={labelTag}>FEBRUARY 15, 2026</Text>
                  <Heading as="h1" style={h1Style}>
                    SOVEREIGN AI: THE NEW GLOBAL ORDER.
                  </Heading>
                  <Text style={heroText}>
                    Canada and Germany have just signed a Joint Declaration to launch the <b>Sovereign Technology Alliance</b>. This isn't just news; it's a strategic pivot to reduce tech dependency and secure the future of compute.
                  </Text>
                  <Button href={ctaLink} style={primaryButton} className="mobile-button">
                    BUILD YOUR AI NEWSLETTER
                  </Button>
                </td>
              </tr>
            </table>
          </Section>

          {/* NEWS GRID SECTION */}
          <Section style={sectionSpacing} className="content-padding">
            <Heading as="h2" style={h2Style}>LATEST INTELLIGENCE</Heading>
            
            <Row>
              {/* News Item 1 */}
              <Column className="stack-column" style={{ width: '50%', paddingRight: '15px', verticalAlign: 'top' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={newsCard}>
                  <tr>
                    <td style={{ padding: '20px' }}>
                      <Img 
                        src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bold-neobrutalist-graphic-representing-comput-701715.png"
                        alt="Abstract digital nodes connecting Canada and Germany"
                        width="260"
                        height="180"
                        style={cardImage}
                      />
                      <Heading as="h3" style={h3Style}>Compute Autonomy</Heading>
                      <Text style={cardText}>
                        The alliance focuses on secure infrastructure, ensuring AI research stays within trusted borders.
                      </Text>
                      <Link href={ctaLink} style={textLink}>Read Analysis &rarr;</Link>
                    </td>
                  </tr>
                </table>
              </Column>

              {/* News Item 2 */}
              <Column className="stack-column" style={{ width: '50%', paddingLeft: '15px', verticalAlign: 'top' }}>
                <table width="100%" cellPadding="0" cellSpacing="0" style={newsCard}>
                  <tr>
                    <td style={{ padding: '20px' }}>
                      <Img 
                        src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-neobrutalist-typographic-poster-representing-701210.png"
                        alt="Graphic representing a bridge of binary code"
                        width="260"
                        height="180"
                        style={cardImage}
                      />
                      <Heading as="h3" style={h3Style}>The Talent Bridge</Heading>
                      <Text style={cardText}>
                        New pipelines for AI researchers between Munich and Ottawa are set to accelerate commercialization.
                      </Text>
                      <Link href={ctaLink} style={textLink}>View Pipelines &rarr;</Link>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
          </Section>

          {/* FEATURE HIGHLIGHT: AI GENERATION */}
          <Section style={featureSection} className="content-padding">
            <table width="100%" cellPadding="0" cellSpacing="0" style={indigoCard}>
              <tr>
                <td style={{ padding: '40px' }}>
                  <Heading as="h2" style={h2WhiteStyle}>
                    CONVERT NEWS INTO CONTENT IN SECONDS.
                  </Heading>
                  <Text style={pWhiteStyle}>
                    Don't just read the news—own it. Emlet's AI-powered engine summarizes complex tech shifts into high-conversion newsletters instantly.
                  </Text>
                  <Row style={{ marginTop: '24px' }}>
                    <Column style={{ width: '50%' }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={pillStyle}>DRAG-AND-DROP</td>
                        </tr>
                      </table>
                    </Column>
                    <Column style={{ width: '50%' }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td style={pillStyle}>AI SUMMARIES</td>
                        </tr>
                      </table>
                    </Column>
                  </Row>
                </td>
              </tr>
            </table>
          </Section>

          {/* FOOTER */}
          <Section style={footerSection}>
            <Container style={{ padding: '40px 20px' }}>
              <Row style={{ marginBottom: '30px' }}>
                <Column align="center">
                  <Img
                    src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                    width="100"
                    alt="Emlet Logo"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Column>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Column align="center">
                  <table cellPadding="0" cellSpacing="0" align="center">
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
                © 2026 Emlet Technologies Inc. All rights reserved.<br />
                Create, curate, and send AI-assisted newsletters with ease.
              </Text>
              <Text style={footerSubtext}>
                This email was sent to you by Emlet. You can <Link href={unsubscribeUrl} style={footerLink}>unsubscribe here</Link> if you no longer wish to receive these updates.
              </Text>
            </Container>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// STYLES
const mainBody = {
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
  padding: '30px 0',
  backgroundColor: '#ffffff',
};

const logoStyle = {
  display: 'block',
  margin: '0 auto',
};

const heroSection = {
  padding: '20px 0 40px 0',
  backgroundColor: '#ffffff',
};

const brutalistHeroCard = {
  backgroundColor: '#f8f9fa',
  border: '4px solid #1a1a1a',
  boxShadow: '8px 8px 0px #1a1a1a',
};

const labelTag = {
  display: 'inline-block',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '1px',
  marginBottom: '16px',
};

const h1Style = {
  fontSize: '36px',
  lineHeight: '1.1',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 20px 0',
  textTransform: 'uppercase',
};

const heroText = {
  fontSize: '18px',
  lineHeight: '1.5',
  color: '#1a1a1a',
  margin: '0 0 30px 0',
};

const primaryButton = {
  backgroundColor: '#5c5cf0',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '800',
  textDecoration: 'none',
  padding: '18px 32px',
  borderRadius: '0px',
  border: '3px solid #1a1a1a',
  boxShadow: '5px 5px 0px #1a1a1a',
  display: 'inline-block',
};

const sectionSpacing = {
  padding: '40px 0',
  backgroundColor: '#ffffff',
};

const h2Style = {
  fontSize: '28px',
  fontWeight: '900',
  color: '#1a1a1a',
  margin: '0 0 24px 0',
  textTransform: 'uppercase',
};

const newsCard = {
  backgroundColor: '#ffffff',
  border: '3px solid #1a1a1a',
  boxShadow: '6px 6px 0px #1a1a1a',
  height: '420px',
};

const cardImage = {
  width: '100%',
  height: 'auto',
  border: '2px solid #1a1a1a',
  marginBottom: '16px',
  display: 'block',
};

const h3Style = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#1a1a1a',
  margin: '0 0 10px 0',
};

const cardText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#4b5563',
  margin: '0 0 16px 0',
};

const textLink = {
  color: '#5c5cf0',
  fontWeight: '700',
  textDecoration: 'none',
  fontSize: '14px',
};

const featureSection = {
  padding: '40px 0',
  backgroundColor: '#ffffff',
};

const indigoCard = {
  backgroundColor: '#5c5cf0',
  border: '4px solid #1a1a1a',
  boxShadow: '8px 8px 0px #1a1a1a',
};

const h2WhiteStyle = {
  fontSize: '32px',
  lineHeight: '1.1',
  fontWeight: '900',
  color: '#ffffff',
  margin: '0 0 20px 0',
  textTransform: 'uppercase',
};

const pWhiteStyle = {
  fontSize: '18px',
  lineHeight: '1.5',
  color: '#ffffff',
  margin: '0',
};

const pillStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #1a1a1a',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: '800',
  color: '#1a1a1a',
  textAlign: 'center',
};

const footerSection = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#9ca3af',
  textAlign: 'center',
  margin: '0 0 20px 0',
};

const footerSubtext = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#6b7280',
  textAlign: 'center',
  margin: '0',
};

const footerLink = {
  color: '#ffffff',
  textDecoration: 'underline',
};
