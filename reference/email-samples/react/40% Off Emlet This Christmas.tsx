import React from 'react';
import { Container, Row, Column, Heading, Head, Body, Text, Button, Img, Link, Html, Section, Hr, Preview, Tailwind, Markdown, Font, CodeBlock } from '@react-email/components';

const accentColor = '#5c5cf0';
const darkBg = '#0a0a0a';
const whiteBg = '#ffffff';
const offWhite = '#f8f9fa';
const textDark = '#1a1a1a';
const textMuted = '#6b7280';
const borderHeavy = '#1a1a1a';
const holidayRed = '#e53e3e';
const holidayGreen = '#38a169';
const shadowColor = '#1a1a1a';
const discountCode = 'JOLLY40';
const ctaLink = 'https://emlet.app/pricing';
const websiteUrl = 'https://emlet.app';

const bodyStyle = {
  backgroundColor: offWhite,
  margin: '0',
  padding: '0',
  fontFamily: "'Inter', Arial, Helvetica, sans-serif",
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: whiteBg,
};

const headerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: whiteBg,
  paddingTop: '24px',
  paddingBottom: '24px',
  paddingLeft: '40px',
  paddingRight: '40px',
  borderBottom: '4px solid ' + borderHeavy,
};

const heroBannerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: accentColor,
  paddingTop: '60px',
  paddingBottom: '60px',
  paddingLeft: '40px',
  paddingRight: '40px',
};

const heroHeadingStyle = {
  fontSize: '42px',
  fontWeight: '900',
  color: whiteBg,
  margin: '0 0 8px 0',
  lineHeight: '1.1',
  letterSpacing: '-1px',
};

const heroSubHeadingStyle = {
  fontSize: '64px',
  fontWeight: '900',
  color: '#fef08a',
  margin: '0 0 20px 0',
  lineHeight: '1.0',
  letterSpacing: '-2px',
};

const heroTextStyle = {
  fontSize: '17px',
  lineHeight: '1.5',
  color: '#e0e0ff',
  margin: '0 0 32px 0',
  fontWeight: '400',
};

const heroCta = {
  backgroundColor: whiteBg,
  color: textDark,
  fontSize: '16px',
  fontWeight: '800',
  textDecoration: 'none',
  padding: '16px 40px',
  borderRadius: '0px',
  display: 'inline-block',
  border: '4px solid ' + borderHeavy,
  letterSpacing: '0.5px',
};

const couponSectionStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#fef08a',
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  borderBottom: '4px solid ' + borderHeavy,
};

const couponLabelStyle = {
  fontSize: '14px',
  fontWeight: '800',
  color: textDark,
  margin: '0 0 8px 0',
  letterSpacing: '2px',
};

const couponBoxOuterStyle = {
  backgroundColor: whiteBg,
  border: '4px solid ' + borderHeavy,
  padding: '16px 32px',
  textAlign: 'center',
  boxShadow: '6px 6px 0px ' + shadowColor,
};

const couponCodeStyle = {
  fontSize: '32px',
  fontWeight: '900',
  color: accentColor,
  margin: '0',
  letterSpacing: '4px',
};

const couponNoteStyle = {
  fontSize: '13px',
  fontWeight: '500',
  color: textMuted,
  margin: '12px 0 0 0',
  lineHeight: '1.4',
};

const featureSectionStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: whiteBg,
  paddingTop: '60px',
  paddingBottom: '60px',
  paddingLeft: '40px',
  paddingRight: '40px',
};

const featureSectionHeadingStyle = {
  fontSize: '28px',
  fontWeight: '900',
  color: textDark,
  margin: '0 0 12px 0',
  lineHeight: '1.2',
  textAlign: 'center',
};

const featureSectionSubStyle = {
  fontSize: '15px',
  fontWeight: '400',
  color: textMuted,
  margin: '0 0 40px 0',
  lineHeight: '1.5',
  textAlign: 'center',
};

const featureItemStyle = {
  backgroundColor: whiteBg,
  borderBottom: '3px solid ' + borderHeavy,
  padding: '20px 0',
  width: '100%',
};

const featureIconCellStyle = {
  width: '56px',
  paddingRight: '16px',
  verticalAlign: 'middle',
};

const featureTextCellStyle = {
  verticalAlign: 'middle',
};

const featureTitleStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: textDark,
  margin: '0 0 4px 0',
  lineHeight: '1.3',
};

const featureDescStyle = {
  fontSize: '14px',
  fontWeight: '400',
  color: textMuted,
  margin: '0',
  lineHeight: '1.4',
};

const testimonialSectionStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: darkBg,
  paddingTop: '60px',
  paddingBottom: '60px',
  paddingLeft: '40px',
  paddingRight: '40px',
};

const testimonialQuoteStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: whiteBg,
  margin: '0 0 20px 0',
  lineHeight: '1.5',
  fontStyle: 'italic',
};

const testimonialAuthorStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#fef08a',
  margin: '0 0 4px 0',
};

const testimonialRoleStyle = {
  fontSize: '13px',
  fontWeight: '400',
  color: '#9ca3af',
  margin: '0',
};

const ctaSectionStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: holidayRed,
  paddingTop: '50px',
  paddingBottom: '50px',
  paddingLeft: '40px',
  paddingRight: '40px',
  textAlign: 'center',
};

const ctaHeadingStyle = {
  fontSize: '30px',
  fontWeight: '900',
  color: whiteBg,
  margin: '0 0 12px 0',
  lineHeight: '1.2',
};

const ctaSubStyle = {
  fontSize: '16px',
  fontWeight: '400',
  color: '#fecaca',
  margin: '0 0 32px 0',
  lineHeight: '1.5',
};

const ctaButtonStyle = {
  backgroundColor: whiteBg,
  color: textDark,
  fontSize: '16px',
  fontWeight: '800',
  textDecoration: 'none',
  padding: '16px 40px',
  borderRadius: '0px',
  display: 'inline-block',
  border: '4px solid ' + borderHeavy,
  letterSpacing: '0.5px',
};

const footerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: darkBg,
  paddingTop: '40px',
  paddingBottom: '40px',
  paddingLeft: '40px',
  paddingRight: '40px',
  borderTop: '4px solid ' + accentColor,
};

const footerTextStyle = {
  fontSize: '13px',
  fontWeight: '400',
  color: '#9ca3af',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
  textAlign: 'center',
};

const footerLinkStyle = {
  color: '#9ca3af',
  textDecoration: 'underline',
};

const socialLinkStyle = {
  display: 'inline-block',
  textDecoration: 'none',
};

const features = [
  {
    icon: 'https://cdn.migma.ai/icons/lu/LuLayoutDashboard/5c5cf0.png',
    title: 'Drag-and-Drop Builder',
    desc: '10+ customizable components. Build newsletters in minutes, not hours.',
  },
  {
    icon: 'https://cdn.migma.ai/icons/lu/LuSparkles/5c5cf0.png',
    title: 'AI Content Generation',
    desc: 'Write compelling copy instantly. Your voice, amplified by AI.',
  },
  {
    icon: 'https://cdn.migma.ai/icons/lu/LuSmartphone/5c5cf0.png',
    title: 'Responsive by Default',
    desc: 'Every layout looks perfect on mobile and desktop. Zero extra work.',
  },
  {
    icon: 'https://cdn.migma.ai/icons/lu/LuType/5c5cf0.png',
    title: 'Email-Safe Font Library',
    desc: 'Consistent rendering across every mail client. No surprises.',
  },
];

export default function EmletChristmasSaleEmail({
  firstName = 'there',
  unsubscribeUrl = '|_LINK_|',
  preferencesUrl = '|_LINK_|',
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>40% Off Emlet This Christmas</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={900}
          fontStyle="normal"
        />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          @media (prefers-color-scheme: dark) {}
          @media (prefers-color-scheme: light) {}
          @media only screen and (max-width: 600px) {
            .mobile-image { width: 100% !important; height: auto !important; }
            .mobile-button { max-width: 320px !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: auto !important; margin-right: auto !important; display: block !important; box-sizing: border-box !important; text-align: center !important; }
            .content-padding { padding-left: 20px !important; padding-right: 20px !important; }
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
            .hero-heading { font-size: 32px !important; }
            .hero-big { font-size: 48px !important; }
            .coupon-code { font-size: 26px !important; }
            .cta-heading { font-size: 24px !important; }
          }
          body { background-color: ${offWhite}; }
        `}</style>
      </Head>
      <Preview>{'Your gift from Emlet: 40% off all plans this Christmas. Build high-converting newsletters in minutes with our drag-and-drop builder and AI tools.'}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          <Section style={headerStyle} className="content-padding">
            <Row>
              <Column style={{ width: '50%', verticalAlign: 'middle' }}>
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  alt="Emlet logo featuring the word emlet in a modern digital font with a small glowing blue accent dot"
                  width="110"
                  height="auto"
                  style={{ display: 'block', maxWidth: '110px', height: 'auto' }}
                />
              </Column>
              <Column style={{ width: '50%', verticalAlign: 'middle', textAlign: 'right' }}>
                <table cellPadding="0" cellSpacing="0" role="presentation" style={{ display: 'inline-table' }}>
                  <tr>
                    <td style={{ backgroundColor: holidayRed, padding: '6px 14px', border: '3px solid ' + borderHeavy, boxShadow: '3px 3px 0px ' + shadowColor }}>
                      <Text style={{ fontSize: '12px', fontWeight: '800', color: whiteBg, margin: '0', letterSpacing: '1px' }}>CHRISTMAS SALE</Text>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
          </Section>

          <Section style={heroBannerStyle} className="content-padding">
            <Heading as="h1" style={heroHeadingStyle} className="hero-heading">
              Your newsletters deserve a glow-up this holiday.
            </Heading>
            <Text style={heroSubHeadingStyle} className="hero-big">
              40% OFF
            </Text>
            <Text style={heroTextStyle}>
              Unwrap serious savings on Emlet. Build stunning, high-converting newsletters with drag-and-drop ease, AI-powered content, and pixel-perfect responsive design.
            </Text>
            <Button href={ctaLink} style={heroCta} className="mobile-button">
              Claim Your Discount
            </Button>
          </Section>

          <Section style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: whiteBg, padding: '0' }}>
            <Img
              src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/gen-gemini-bold-typographic-poster-in-neobrutalist-style-226833.png"
              alt="A bold typographic poster composition with large block letters spelling BUILD on a clean white background, accented with vibrant indigo geometric shapes, scattered snowflake patterns in light gray, and subtle grain texture giving a screen-printed holiday feel. Festive but modern and tech-forward."
              width="600"
              height="320"
              style={{ display: 'block', width: '100%', height: 'auto', borderBottom: '4px solid ' + borderHeavy }}
              className="mobile-image"
            />
          </Section>

          <Section style={couponSectionStyle} className="content-padding">
            <Text style={couponLabelStyle}>YOUR EXCLUSIVE CODE</Text>
            <table cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tr>
                <td style={couponBoxOuterStyle}>
                  <Text style={couponCodeStyle} className="coupon-code">{discountCode}</Text>
                </td>
              </tr>
            </table>
            <Text style={couponNoteStyle}>
              Apply at checkout. Valid on all annual and monthly plans through December 31, 2026.
            </Text>
          </Section>

          <Section style={featureSectionStyle} className="content-padding">
            <Heading as="h2" style={featureSectionHeadingStyle}>
              What you get with Emlet
            </Heading>
            <Text style={featureSectionSubStyle}>
              Everything you need to launch newsletters that convert.
            </Text>

            {features.map((feature, index) => (
              <Section key={index} style={featureItemStyle}>
                <table style={{ width: '100%' }} cellPadding="0" cellSpacing="0" role="presentation">
                  <tr>
                    <td style={featureIconCellStyle}>
                      <table cellPadding="0" cellSpacing="0" role="presentation">
                        <tr>
                          <td style={{ backgroundColor: '#eef2ff', border: '3px solid ' + borderHeavy, padding: '10px', boxShadow: '4px 4px 0px ' + shadowColor }}>
                            <Img
                              src={feature.icon}
                              alt={feature.title + ' icon'}
                              width="24"
                              height="auto"
                              style={{ display: 'block', height: '24px', width: 'auto' }}
                            />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style={featureTextCellStyle}>
                      <Text style={featureTitleStyle}>{feature.title}</Text>
                      <Text style={featureDescStyle}>{feature.desc}</Text>
                    </td>
                  </tr>
                </table>
              </Section>
            ))}
          </Section>

          <Section style={testimonialSectionStyle} className="content-padding">
            <table cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tr>
                <td style={{ borderLeft: '4px solid ' + accentColor, paddingLeft: '20px' }}>
                  <Text style={testimonialQuoteStyle}>
                    &ldquo;We cut our newsletter production time by 80%. Emlet paid for itself in the first week.&rdquo;
                  </Text>
                  <Text style={testimonialAuthorStyle}>Sarah Chen</Text>
                  <Text style={testimonialRoleStyle}>Head of Growth, Vercel</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: whiteBg, paddingTop: '50px', paddingBottom: '50px', paddingLeft: '40px', paddingRight: '40px' }} className="content-padding">
            <Row>
              <Column className="stack-column" style={{ width: '50%', verticalAlign: 'top', paddingRight: '12px' }}>
                <table cellPadding="0" cellSpacing="0" role="presentation" width="100%" style={{ border: '4px solid ' + borderHeavy, boxShadow: '6px 6px 0px ' + shadowColor }}>
                  <tr>
                    <td style={{ backgroundColor: '#eef2ff', padding: '28px', textAlign: 'center' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '800', color: accentColor, margin: '0 0 4px 0', letterSpacing: '1px' }}>MONTHLY</Text>
                      <Text style={{ fontSize: '36px', fontWeight: '900', color: textDark, margin: '0 0 4px 0', lineHeight: '1.1' }}>
                        <s style={{ color: textMuted, fontWeight: '400', fontSize: '20px' }}>$29</s> $17
                      </Text>
                      <Text style={{ fontSize: '13px', fontWeight: '400', color: textMuted, margin: '0 0 20px 0' }}>per month</Text>
                      <Button href={ctaLink} style={{ backgroundColor: accentColor, color: whiteBg, fontSize: '14px', fontWeight: '800', textDecoration: 'none', padding: '12px 24px', borderRadius: '0px', display: 'inline-block', border: '3px solid ' + borderHeavy }} className="mobile-button">
                        Get Started
                      </Button>
                    </td>
                  </tr>
                </table>
              </Column>
              <Column className="stack-column" style={{ width: '50%', verticalAlign: 'top', paddingLeft: '12px' }}>
                <table cellPadding="0" cellSpacing="0" role="presentation" width="100%" style={{ border: '4px solid ' + borderHeavy, boxShadow: '6px 6px 0px ' + accentColor }}>
                  <tr>
                    <td style={{ backgroundColor: accentColor, padding: '28px', textAlign: 'center' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '800', color: '#fef08a', margin: '0 0 4px 0', letterSpacing: '1px' }}>ANNUAL (BEST VALUE)</Text>
                      <Text style={{ fontSize: '36px', fontWeight: '900', color: whiteBg, margin: '0 0 4px 0', lineHeight: '1.1' }}>
                        <s style={{ color: '#c7c7ff', fontWeight: '400', fontSize: '20px' }}>$290</s> $174
                      </Text>
                      <Text style={{ fontSize: '13px', fontWeight: '400', color: '#c7c7ff', margin: '0 0 20px 0' }}>per year</Text>
                      <Button href={ctaLink} style={{ backgroundColor: whiteBg, color: textDark, fontSize: '14px', fontWeight: '800', textDecoration: 'none', padding: '12px 24px', borderRadius: '0px', display: 'inline-block', border: '3px solid ' + borderHeavy }} className="mobile-button">
                        Save 40% Now
                      </Button>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
          </Section>

          <Section style={ctaSectionStyle} className="content-padding">
            <Heading as="h2" style={ctaHeadingStyle} className="cta-heading">
              Don&rsquo;t let this gift expire.
            </Heading>
            <Text style={ctaSubStyle}>
              This is Emlet&rsquo;s biggest sale of the year. Lock in 40% off before midnight on December 31.
            </Text>
            <Button href={ctaLink} style={ctaButtonStyle} className="mobile-button">
              Launch Your Newsletter
            </Button>
          </Section>

          <Section style={footerStyle} className="content-padding">
            <Row style={{ marginBottom: '20px' }}>
              <Column align="center">
                <Img
                  src="https://cdn.migma.ai/projects/6990b4f220e8b984bbd79cda/images/image-ykxjng.png"
                  alt="Emlet logo in dark theme"
                  width="80"
                  height="auto"
                  style={{ display: 'block', maxWidth: '80px', height: 'auto', margin: '0 auto' }}
                />
              </Column>
            </Row>

            <Row style={{ marginBottom: '20px' }}>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" role="presentation" align="center">
                  <tr>
                    <td style={{ paddingRight: '16px' }}>
                      <Link href="https://twitter.com/emlet" target="_blank" style={socialLinkStyle}>
                        <Img
                          src="https://cdn.migma.ai/icons/fa6/FaXTwitter/ffffff.png"
                          alt="Emlet on X formerly Twitter"
                          width="24"
                          height="auto"
                          style={{ display: 'inline-block', outline: 'none', border: 'none', textDecoration: 'none', height: 'auto' }}
                        />
                      </Link>
                    </td>
                    <td style={{ paddingRight: '16px' }}>
                      <Link href="https://linkedin.com/company/emlet" target="_blank" style={socialLinkStyle}>
                        <Img
                          src="https://cdn.migma.ai/icons/fa/FaLinkedin/ffffff.png"
                          alt="Emlet on LinkedIn"
                          width="24"
                          height="auto"
                          style={{ display: 'inline-block', outline: 'none', border: 'none', textDecoration: 'none', height: 'auto' }}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link href="https://github.com/emlet" target="_blank" style={socialLinkStyle}>
                        <Img
                          src="https://cdn.migma.ai/icons/fa/FaGithub/ffffff.png"
                          alt="Emlet on GitHub"
                          width="24"
                          height="auto"
                          style={{ display: 'inline-block', outline: 'none', border: 'none', textDecoration: 'none', height: 'auto' }}
                        />
                      </Link>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>

            <Row style={{ marginBottom: '12px' }}>
              <Column align="center">
                <table cellPadding="0" cellSpacing="0" role="presentation" align="center">
                  <tr>
                    <td style={{ paddingRight: '20px' }}>
                      <Link href="https://emlet.app/features" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Features</Link>
                    </td>
                    <td style={{ paddingRight: '20px' }}>
                      <Link href="https://emlet.app/pricing" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Pricing</Link>
                    </td>
                    <td style={{ paddingRight: '20px' }}>
                      <Link href="https://emlet.app/contact" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Contact</Link>
                    </td>
                    <td>
                      <Link href="https://emlet.app/about" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>About</Link>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>

            <Hr style={{ borderColor: '#2a2a2a', margin: '20px 0' }} />

            <Text style={footerTextStyle}>
              {'\u00A9'} 2026 Emlet Technologies Inc. All rights reserved.
            </Text>
            <Text style={footerTextStyle}>
              Create, curate, and send AI-assisted newsletters with ease.
            </Text>
            <Text style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280', margin: '16px 0 0 0', lineHeight: '1.5', textAlign: 'center' }}>
              This email was sent to you by Emlet Technologies Inc. You can{' '}
              <Link href={preferencesUrl} target="_blank" style={footerLinkStyle}>manage your preferences</Link>
              {' '}or{' '}
              <Link href={unsubscribeUrl} target="_blank" style={footerLinkStyle}>unsubscribe</Link>
              {' '}at any time.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
