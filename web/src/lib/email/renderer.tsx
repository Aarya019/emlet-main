import React from 'react';
import { render } from '@react-email/render';
import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Link,
  Img,
  Hr,
} from '@react-email/components';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/gemini';
import type { BrandProfile } from '@/lib/db/types';

// ─────────────────────────────────────────────
// Style definitions per design style
// ─────────────────────────────────────────────

interface StyleConfig {
  fontFamily: string;
  headingFontFamily: string;
  googleFontsUrl: string;
  bodyBg: string;
  bodyColor: string;
  headingWeight: string;
  headingLetterSpacing: string;
  borderRadius: string;
  sectionPadding: string;
  buttonBorderRadius: string;
  buttonPadding: string;
  containerBorder: string;
  heroAlign: 'center' | 'left';
  hrStyle: React.CSSProperties;
  sectionBorderStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
}

const styleConfigs: Record<string, StyleConfig> = {
  minimalist: {
    fontFamily: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
    headingFontFamily: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap",
    bodyBg: '#f9f9f9',
    bodyColor: '#1a1a1a',
    headingWeight: '500',
    headingLetterSpacing: '-0.02em',
    borderRadius: '4px',
    sectionPadding: '32px 0',
    buttonBorderRadius: '4px',
    buttonPadding: '12px 28px',
    containerBorder: '1px solid #e8e8e8',
    heroAlign: 'center',
    hrStyle: { borderColor: '#eeeeee', borderWidth: '1px', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#ffffff', borderRadius: '4px', padding: '24px', border: '1px solid #f0f0f0' },
  },
  editorial: {
    fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
    headingFontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap",
    bodyBg: '#fefefe',
    bodyColor: '#1a1a1a',
    headingWeight: '700',
    headingLetterSpacing: '0',
    borderRadius: '0',
    sectionPadding: '28px 0',
    buttonBorderRadius: '0',
    buttonPadding: '12px 28px',
    containerBorder: '1px solid #ddd',
    heroAlign: 'left',
    hrStyle: { borderColor: '#1a1a1a', borderWidth: '2px', margin: '24px 0' },
    sectionBorderStyle: { borderLeft: '4px solid #1a1a1a', paddingLeft: '16px' },
    cardStyle: { backgroundColor: '#f5f5f5', padding: '20px', borderLeft: '3px solid #1a1a1a' },
  },
  retro: {
    fontFamily: "'Nunito', Georgia, sans-serif",
    headingFontFamily: "'DM Serif Display', Georgia, 'Times New Roman', serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;700&display=swap",
    bodyBg: '#fdf6e3',
    bodyColor: '#3b2a1a',
    headingWeight: '700',
    headingLetterSpacing: '0.02em',
    borderRadius: '12px',
    sectionPadding: '28px 0',
    buttonBorderRadius: '20px',
    buttonPadding: '12px 28px',
    containerBorder: '2px solid #c8a96e',
    heroAlign: 'center',
    hrStyle: { borderColor: '#c8a96e', borderWidth: '2px', borderStyle: 'dashed', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#fffbf0', borderRadius: '12px', padding: '24px', border: '2px solid #c8a96e' },
  },
  brutalist: {
    fontFamily: "'Space Grotesk', 'Arial Black', Helvetica, sans-serif",
    headingFontFamily: "'Space Grotesk', 'Arial Black', Helvetica, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
    bodyBg: '#ffffff',
    bodyColor: '#000000',
    headingWeight: '900',
    headingLetterSpacing: '-0.03em',
    borderRadius: '0',
    sectionPadding: '32px 0',
    buttonBorderRadius: '0',
    buttonPadding: '14px 32px',
    containerBorder: '4px solid #000000',
    heroAlign: 'left',
    hrStyle: { borderColor: '#000000', borderWidth: '4px', margin: '24px 0' },
    sectionBorderStyle: { border: '3px solid #000', padding: '16px' },
    cardStyle: { backgroundColor: '#ffffff', padding: '24px', border: '3px solid #000000', boxShadow: '6px 6px 0px #000000' },
  },
  cyberpunk: {
    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    headingFontFamily: "'Orbitron', 'Courier New', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap",
    bodyBg: '#0a0a0f',
    bodyColor: '#e0e0ff',
    headingWeight: '700',
    headingLetterSpacing: '0.05em',
    borderRadius: '2px',
    sectionPadding: '28px 0',
    buttonBorderRadius: '2px',
    buttonPadding: '12px 28px',
    containerBorder: '1px solid #00ffff',
    heroAlign: 'center',
    hrStyle: { borderColor: '#00ffff', borderWidth: '1px', margin: '24px 0' },
    sectionBorderStyle: { borderLeft: '3px solid #00ffff', paddingLeft: '16px' },
    cardStyle: { backgroundColor: '#0f0f1a', padding: '20px', border: '1px solid #00ffff', borderRadius: '2px' },
  },
  handwritten: {
    fontFamily: "'Nunito', Georgia, serif",
    headingFontFamily: "'Caveat', Georgia, serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Nunito:wght@400;600&display=swap",
    bodyBg: '#fdfaf5',
    bodyColor: '#2c2c2c',
    headingWeight: '600',
    headingLetterSpacing: '0.01em',
    borderRadius: '8px',
    sectionPadding: '24px 0',
    buttonBorderRadius: '8px',
    buttonPadding: '12px 28px',
    containerBorder: '2px solid #d4c5a9',
    heroAlign: 'center',
    hrStyle: { borderColor: '#d4c5a9', borderWidth: '1px', borderStyle: 'dashed', margin: '20px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#fffef9', padding: '24px', borderRadius: '8px', border: '1px dashed #d4c5a9' },
  },
  bauhaus: {
    fontFamily: "'Work Sans', Arial, Helvetica, sans-serif",
    headingFontFamily: "'Bebas Neue', Arial, Helvetica, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;700&display=swap",
    bodyBg: '#ffffff',
    bodyColor: '#000000',
    headingWeight: '900',
    headingLetterSpacing: '-0.02em',
    borderRadius: '0',
    sectionPadding: '32px 0',
    buttonBorderRadius: '0',
    buttonPadding: '14px 32px',
    containerBorder: '3px solid #000000',
    heroAlign: 'left',
    hrStyle: { borderColor: '#cc0000', borderWidth: '4px', margin: '24px 0' },
    sectionBorderStyle: {},
    cardStyle: { backgroundColor: '#f5f5f5', padding: '24px', border: '3px solid #000' },
  },
};

// ─────────────────────────────────────────────
// Section renderers
// ─────────────────────────────────────────────

function renderHero(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding, textAlign: config.heroAlign, backgroundColor: config.bodyBg }
  },
    section.imageUrl
      ? React.createElement(Img, {
          src: section.imageUrl,
          alt: section.imageAlt || '',
          width: '600',
          style: { width: '100%', maxWidth: '600px', marginBottom: '24px', borderRadius: config.borderRadius }
        })
      : null,
    section.heading
      ? React.createElement(Heading, {
          as: 'h1',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '36px',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: config.bodyColor,
            margin: '0 0 16px 0',
            lineHeight: '1.2',
          }
        }, section.heading)
      : null,
    section.subheading
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '18px',
            color: config.bodyColor + '99',
            margin: '0',
            lineHeight: '1.6',
          }
        }, section.subheading)
      : null
  );
}

function renderContent(section: EmailSection, config: StyleConfig): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding, ...config.sectionBorderStyle }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: config.bodyColor,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    section.text
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '16px',
            color: config.bodyColor,
            lineHeight: '1.7',
            margin: '0',
          }
        }, section.text)
      : null
  );
}

function renderTestimonial(section: EmailSection, config: StyleConfig, primaryColor: string, secondaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    React.createElement('div', {
      style: {
        ...config.cardStyle,
        textAlign: 'center' as const,
        borderTop: `4px solid ${secondaryColor}`,
      }
    },
      section.authorImage
        ? React.createElement(Img, {
            src: section.authorImage,
            alt: section.author || '',
            width: '64',
            height: '64',
            style: { borderRadius: '50%', margin: '0 auto 16px auto', display: 'block' }
          })
        : null,
      section.quote
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '18px',
              fontStyle: 'italic',
              color: config.bodyColor,
              lineHeight: '1.6',
              margin: '0 0 16px 0',
            }
          }, `"${section.quote}"`)
        : null,
      section.author
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '14px',
              fontWeight: '700',
              color: primaryColor,
              margin: '0 0 4px 0',
            }
          }, section.author)
        : null,
      section.authorTitle
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '12px',
              color: config.bodyColor + '88',
              margin: '0',
            }
          }, section.authorTitle)
        : null
    )
  );
}

function renderFeatureList(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            color: config.bodyColor,
            margin: '0 0 20px 0',
          }
        }, section.heading)
      : null,
    ...(section.features || []).map((feature, i) =>
      React.createElement(Section, { key: i, style: { marginBottom: '16px', display: 'table', width: '100%' } },
        React.createElement(Row, null,
          React.createElement(Column, { style: { width: '40px', verticalAlign: 'top' } },
            React.createElement(Text, {
              style: {
                fontSize: '20px',
                margin: '0',
                color: primaryColor,
              }
            }, feature.icon || '✓')
          ),
          React.createElement(Column, { style: { verticalAlign: 'top' } },
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '15px',
                fontWeight: '700',
                color: config.bodyColor,
                margin: '0 0 4px 0',
              }
            }, feature.title),
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '14px',
                color: config.bodyColor + '99',
                margin: '0',
                lineHeight: '1.5',
              }
            }, feature.description)
          )
        )
      )
    )
  );
}

function renderPricingTable(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const plans = section.plans || [];
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            color: config.bodyColor,
            margin: '0 0 20px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...plans.map((plan, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: {
            padding: '16px',
            textAlign: 'center' as const,
            ...(plan.highlighted ? {
              backgroundColor: primaryColor,
              color: '#fff',
              borderRadius: config.borderRadius,
            } : config.cardStyle)
          }
        },
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '14px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: plan.highlighted ? '#fff' : config.bodyColor + '88',
              margin: '0 0 8px 0',
            }
          }, plan.name),
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '36px',
              fontWeight: '900',
              color: plan.highlighted ? '#fff' : config.bodyColor,
              margin: '0 0 4px 0',
              lineHeight: '1',
            }
          }, plan.price),
          plan.period
            ? React.createElement(Text, {
                style: {
                  fontFamily: config.fontFamily,
                  fontSize: '12px',
                  color: plan.highlighted ? '#ffffffcc' : config.bodyColor + '88',
                  margin: '0 0 16px 0',
                }
              }, plan.period)
            : null,
          React.createElement(Hr, { style: { borderColor: plan.highlighted ? '#ffffff44' : '#e0e0e0', margin: '12px 0' } }),
          ...(plan.features || []).map((feat, j) =>
            React.createElement(Text, {
              key: j,
              style: {
                fontFamily: config.fontFamily,
                fontSize: '13px',
                color: plan.highlighted ? '#ffffffdd' : config.bodyColor,
                margin: '4px 0',
              }
            }, `✓ ${feat}`)
          ),
          plan.buttonText
            ? React.createElement(Button, {
                href: '#',
                className: 'em-btn',
                style: {
                  display: 'block',
                  marginTop: '16px',
                  padding: config.buttonPadding,
                  backgroundColor: plan.highlighted ? '#fff' : primaryColor,
                  color: plan.highlighted ? primaryColor : '#fff',
                  fontFamily: config.fontFamily,
                  fontWeight: '700',
                  fontSize: '14px',
                  borderRadius: config.buttonBorderRadius,
                  textDecoration: 'none',
                }
              }, plan.buttonText)
            : null
        )
      )
    )
  );
}

function renderStats(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const stats = section.stats || [];
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            color: config.bodyColor,
            margin: '0 0 20px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...stats.map((stat, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: { textAlign: 'center' as const, padding: '12px' }
        },
          stat.icon
            ? React.createElement(Text, { style: { fontSize: '28px', margin: '0 0 8px 0' } }, stat.icon)
            : null,
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '36px',
              fontWeight: '900',
              color: primaryColor,
              margin: '0 0 4px 0',
              lineHeight: '1',
            }
          }, stat.value),
          React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '13px',
              color: config.bodyColor + '88',
              margin: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }
          }, stat.label)
        )
      )
    )
  );
}

function renderGallery(section: EmailSection, config: StyleConfig): React.ReactElement {
  const images = section.images || [];
  const perRow = Math.min(images.length, 3);
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            color: config.bodyColor,
            margin: '0 0 16px 0',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...images.slice(0, perRow).map((img, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: { padding: '4px' }
        },
          React.createElement(Img, {
            src: img.url,
            alt: img.alt,
            width: '180',
            style: { width: '100%', borderRadius: config.borderRadius, display: 'block' }
          }),
          img.caption
            ? React.createElement(Text, {
                style: {
                  fontFamily: config.fontFamily,
                  fontSize: '11px',
                  color: config.bodyColor + '88',
                  textAlign: 'center',
                  margin: '4px 0 0 0',
                }
              }, img.caption)
            : null
        )
      )
    )
  );
}

function renderAnnouncement(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: {
      padding: config.sectionPadding,
    }
  },
    React.createElement('div', {
      style: {
        backgroundColor: primaryColor + '15',
        border: `2px solid ${primaryColor}`,
        borderRadius: config.borderRadius,
        padding: '24px',
        textAlign: 'center' as const,
      }
    },
      section.heading
        ? React.createElement(Heading, {
            as: 'h2',
            style: {
              fontFamily: config.headingFontFamily,
              fontSize: '22px',
              fontWeight: config.headingWeight,
              color: primaryColor,
              margin: '0 0 12px 0',
            }
          }, section.heading)
        : null,
      section.text
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '15px',
              color: config.bodyColor,
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }
          }, section.text)
        : null,
      section.buttonText
        ? React.createElement(Button, {
            href: section.buttonUrl || '#',
            className: 'em-btn',
            style: {
              padding: config.buttonPadding,
              backgroundColor: primaryColor,
              color: '#ffffff',
              fontFamily: config.fontFamily,
              fontWeight: '700',
              fontSize: '14px',
              borderRadius: config.buttonBorderRadius,
              textDecoration: 'none',
            }
          }, section.buttonText)
        : null
    )
  );
}

function renderCta(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding, textAlign: 'center' as const }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '26px',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: config.bodyColor,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    section.text
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '16px',
            color: config.bodyColor + '99',
            margin: '0 0 24px 0',
            lineHeight: '1.6',
          }
        }, section.text)
      : null,
    section.buttonText
      ? React.createElement(Button, {
          href: section.buttonUrl || '#',
          className: 'em-btn',
          style: {
            padding: config.buttonPadding,
            backgroundColor: primaryColor,
            color: '#ffffff',
            fontFamily: config.fontFamily,
            fontWeight: '700',
            fontSize: '16px',
            borderRadius: config.buttonBorderRadius,
            textDecoration: 'none',
          }
        }, section.buttonText)
      : null
  );
}

function renderFooter(section: EmailSection, config: StyleConfig, secondaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: '24px 0 20px 0', textAlign: 'center' as const }
  },
    React.createElement(Hr, { style: config.hrStyle }),
    section.logoUrl
      ? React.createElement(Img, {
          src: section.logoUrl,
          alt: section.logoAlt || '',
          height: '28',
          className: 'em-logo',
          style: { height: '28px', maxWidth: '120px', width: 'auto', margin: '0 auto 14px auto', display: 'block', opacity: '0.7' }
        })
      : null,
    React.createElement(Text, {
      style: {
        fontFamily: config.fontFamily,
        fontSize: '12px',
        color: config.bodyColor + '66',
        lineHeight: '1.7',
        margin: '0 0 8px 0',
      }
    }, section.text || ''),
    section.buttonText
      ? React.createElement(Link, {
          href: section.buttonUrl || '#',
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            color: secondaryColor,
            textDecoration: 'underline',
          }
        }, section.buttonText)
      : null,
    React.createElement(Text, {
      style: {
        fontFamily: config.fontFamily,
        fontSize: '11px',
        color: config.bodyColor + '44',
        margin: '10px 0 0 0',
      }
    },
      'Don\'t want these emails? ',
      React.createElement(Link, {
        href: section.unsubscribeUrl || '{{unsubscribe_url}}',
        style: {
          fontFamily: config.fontFamily,
          fontSize: '11px',
          color: config.bodyColor + '66',
          textDecoration: 'underline',
        }
      }, 'Unsubscribe')
    )
  );
}

function renderHeader(section: EmailSection, config: StyleConfig, primaryColor: string, secondaryColor: string): React.ReactElement {
  const borderVal = `${config.hrStyle.borderWidth ?? '1px'} ${config.hrStyle.borderStyle ?? 'solid'} ${config.hrStyle.borderColor ?? '#e0e0e0'}`;
  return React.createElement(Section, {
    style: { padding: '20px 0', borderBottom: borderVal, marginBottom: '8px' }
  },
    React.createElement(Row, null,
      React.createElement(Column, { style: { verticalAlign: 'middle' } },
        section.logoUrl
          ? React.createElement(Img, {
              src: section.logoUrl,
              alt: section.logoAlt || 'Logo',
              height: '40',
              className: 'em-logo',
              style: { height: '40px', maxWidth: '160px', width: 'auto', display: 'block' }
            })
          : React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '20px',
                fontWeight: config.headingWeight,
                color: primaryColor,
                margin: '0',
              }
            }, section.logoAlt || 'Brand')
      ),
      section.tagline
        ? React.createElement(Column, { style: { verticalAlign: 'middle', textAlign: 'right' as const } },
            React.createElement(Text, {
              style: {
                fontFamily: config.fontFamily,
                fontSize: '12px',
                color: secondaryColor,
                margin: '0',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                fontWeight: '600',
              }
            }, section.tagline)
          )
        : null
    )
  );
}

function renderImageText(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const isLeft = section.imagePosition !== 'right';
  const hasImage = !!section.imageUrl;

  const imageCol = hasImage ? React.createElement(Column, {
    className: 'em-col',
    style: {
      width: '45%',
      verticalAlign: 'middle' as const,
      paddingRight: isLeft ? '20px' : '0',
      paddingLeft: isLeft ? '0' : '20px',
    }
  },
    React.createElement(Img, {
      src: section.imageUrl!,
      alt: section.imageAlt || '',
      width: '260',
      style: { width: '100%', borderRadius: config.borderRadius, display: 'block' }
    })
  ) : null;

  const textCol = React.createElement(Column, {
    className: 'em-col',
    style: { width: hasImage ? '55%' : '100%', verticalAlign: 'middle' as const }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '22px',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: config.bodyColor,
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    section.text
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '15px',
            color: config.bodyColor,
            lineHeight: '1.7',
            margin: '0 0 16px 0',
          }
        }, section.text)
      : null,
    section.buttonText
      ? React.createElement(Button, {
          href: section.buttonUrl || '#',
          className: 'em-btn',
          style: {
            padding: config.buttonPadding,
            backgroundColor: primaryColor,
            color: '#ffffff',
            fontFamily: config.fontFamily,
            fontWeight: '700',
            fontSize: '14px',
            borderRadius: config.buttonBorderRadius,
            textDecoration: 'none',
          }
        }, section.buttonText)
      : null
  );

  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    hasImage
      ? React.createElement(Row, null,
          ...(isLeft ? [imageCol, textCol] : [textCol, imageCol])
        )
      : textCol
  );
}

function renderCoupon(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    React.createElement('div', {
      style: {
        border: `2px dashed ${primaryColor}`,
        borderRadius: config.borderRadius,
        padding: '32px 24px',
        textAlign: 'center' as const,
        backgroundColor: primaryColor + '0d',
      }
    },
      section.heading
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              color: config.bodyColor + '88',
              margin: '0 0 16px 0',
            }
          }, section.heading)
        : null,
      section.code
        ? React.createElement(Text, {
            style: {
              fontFamily: "'Courier New', 'Courier', monospace",
              fontSize: '30px',
              fontWeight: '900',
              letterSpacing: '0.15em',
              color: primaryColor,
              margin: '0 0 8px 0',
              padding: '10px 24px',
              border: `2px solid ${primaryColor}`,
              borderRadius: config.borderRadius,
              display: 'inline-block',
            }
          }, section.code)
        : null,
      section.text
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '15px',
              color: config.bodyColor,
              margin: '12px 0 8px 0',
              lineHeight: '1.5',
            }
          }, section.text)
        : null,
      section.expiryText
        ? React.createElement(Text, {
            style: {
              fontFamily: config.fontFamily,
              fontSize: '12px',
              color: config.bodyColor + '88',
              margin: '0',
            }
          }, section.expiryText)
        : null
    )
  );
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SOCIAL_ICON_BASE = `${SUPABASE_URL}/storage/v1/object/public/email-images/social`;

const SOCIAL_ICON_MAP: Record<string, string> = {
  twitter:   `${SOCIAL_ICON_BASE}/twitter.png`,
  x:         `${SOCIAL_ICON_BASE}/twitter.png`,
  instagram: `${SOCIAL_ICON_BASE}/instagram.png`,
  facebook:  `${SOCIAL_ICON_BASE}/facebook.png`,
  linkedin:  `${SOCIAL_ICON_BASE}/linkedin.png`,
  tiktok:    `${SOCIAL_ICON_BASE}/tiktok.png`,
  youtube:   `${SOCIAL_ICON_BASE}/youtube.png`,
};

function getSocialIconUrl(link: { platform: string; iconUrl?: string }): string | null {
  if (link.iconUrl) return link.iconUrl;
  const key = link.platform.toLowerCase().trim();
  return SOCIAL_ICON_MAP[key] || null;
}

function renderSocialLinks(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const links = section.socialLinks || [];
  return React.createElement(Section, {
    style: { padding: '16px 0', textAlign: 'center' as const }
  },
    section.heading
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: config.bodyColor + '88',
            margin: '0 0 12px 0',
          }
        }, section.heading)
      : null,
    React.createElement('div', {
      style: { textAlign: 'center' as const }
    },
      ...links.map((link, i) => {
        const resolvedIconUrl = getSocialIconUrl(link);
        return React.createElement(Link, {
          key: i,
          href: link.url,
          style: {
            display: 'inline-block',
            margin: '0 6px',
            color: primaryColor,
            textDecoration: 'none',
            fontFamily: config.fontFamily,
            fontSize: resolvedIconUrl ? undefined : (link.icon ? '22px' : '12px'),
            fontWeight: resolvedIconUrl ? undefined : (link.icon ? '400' : '700'),
            verticalAlign: 'middle',
          }
        },
          resolvedIconUrl
            ? React.createElement(Img, {
                src: resolvedIconUrl,
                alt: link.platform,
                width: '28',
                height: '28',
                style: { width: '28px', height: '28px', display: 'block' }
              })
            : (link.icon || link.platform)
        );
      })
    )
  );
}

function renderColumns(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const colItems = section.columns || [];
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.headingFontFamily,
            fontSize: '24px',
            fontWeight: config.headingWeight,
            letterSpacing: config.headingLetterSpacing,
            color: config.bodyColor,
            margin: '0 0 24px 0',
            textAlign: 'center',
          }
        }, section.heading)
      : null,
    React.createElement(Row, null,
      ...colItems.map((col, i) =>
        React.createElement(Column, {
          key: i,
          className: 'em-col',
          style: { verticalAlign: 'top', padding: '0 8px' }
        },
          React.createElement('div', {
            style: { ...config.cardStyle, textAlign: 'center' as const }
          },
            col.icon
              ? React.createElement(Text, {
                  style: { fontSize: '36px', margin: '0 0 12px 0', lineHeight: '1' }
                }, col.icon)
              : null,
            col.imageUrl
              ? React.createElement(Img, {
                  src: col.imageUrl,
                  alt: col.heading || '',
                  width: '80',
                  height: '80',
                  style: { borderRadius: config.borderRadius, margin: '0 auto 12px auto', display: 'block' }
                })
              : null,
            col.heading
              ? React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '15px',
                    fontWeight: '700',
                    color: config.bodyColor,
                    margin: '0 0 8px 0',
                  }
                }, col.heading)
              : null,
            col.text
              ? React.createElement(Text, {
                  style: {
                    fontFamily: config.fontFamily,
                    fontSize: '13px',
                    color: config.bodyColor + '99',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                  }
                }, col.text)
              : null,
            col.buttonText
              ? React.createElement(Button, {
                  href: col.buttonUrl || '#',
                  className: 'em-btn',
                  style: {
                    padding: '8px 16px',
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                    fontFamily: config.fontFamily,
                    fontWeight: '700',
                    fontSize: '12px',
                    borderRadius: config.buttonBorderRadius,
                    textDecoration: 'none',
                  }
                }, col.buttonText)
              : null
          )
        )
      )
    )
  );
}

function renderDivider(section: EmailSection, config: StyleConfig): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: '4px 0' }
  },
    React.createElement(Hr, { style: config.hrStyle }),
    section.text
      ? React.createElement(Text, {
          style: {
            fontFamily: config.fontFamily,
            fontSize: '11px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            color: config.bodyColor + '66',
            textAlign: 'center' as const,
            margin: '-10px 0 0 0',
          }
        }, section.text)
      : null
  );
}

// ─────────────────────────────────────────────
// Main renderer
// ─────────────────────────────────────────────

function renderSection(
  section: EmailSection,
  config: StyleConfig,
  primaryColor: string,
  secondaryColor: string
): React.ReactElement | null {
  switch (section.type) {
    case 'header':        return renderHeader(section, config, primaryColor, secondaryColor);
    case 'hero':          return renderHero(section, config, primaryColor);
    case 'content':       return renderContent(section, config);
    case 'testimonial':   return renderTestimonial(section, config, primaryColor, secondaryColor);
    case 'feature-list':  return renderFeatureList(section, config, primaryColor);
    case 'pricing-table': return renderPricingTable(section, config, primaryColor);
    case 'stats':         return renderStats(section, config, primaryColor);
    case 'gallery':       return renderGallery(section, config);
    case 'announcement':  return renderAnnouncement(section, config, primaryColor);
    case 'image-text':    return renderImageText(section, config, primaryColor);
    case 'coupon':        return renderCoupon(section, config, primaryColor);
    case 'social-links':  return renderSocialLinks(section, config, primaryColor);
    case 'columns':       return renderColumns(section, config, primaryColor);
    case 'divider':       return renderDivider(section, config);
    case 'cta':           return renderCta(section, config, primaryColor);
    case 'footer':        return renderFooter(section, config, secondaryColor);
    default:              return null;
  }
}

export async function generateEmailHtml(
  email: GeneratedEmail,
  designStyle: string,
  brandProfile: BrandProfile | null
): Promise<{ html: string; reactCode: string }> {
  const config = styleConfigs[designStyle] || styleConfigs.minimalist;
  const primaryColor   = brandProfile?.primary_color   || '#5c5cf0';
  const secondaryColor = brandProfile?.secondary_color || primaryColor;
  const logoUrl        = brandProfile?.logo_url        || null;
  const websiteUrl     = brandProfile?.website_url     || null;
  const brandName      = brandProfile?.brand_name      || 'Company';

  // ── Force-inject brand data into sections ────────────────────────────
  // This guarantees brand assets are present regardless of what the AI returned.
  const processedSections: EmailSection[] = email.sections.map(s => {
    const sec = { ...s };

    // Header: inject brand logo only if the section doesn't already have one set
    if (sec.type === 'header') {
      if (logoUrl && sec.logoUrl === undefined) sec.logoUrl = logoUrl;
      if (!sec.logoAlt) sec.logoAlt = brandName;
    }

    // Hero: use brand logo as the image only when AI left imageUrl undefined (not when user cleared it)
    if (sec.type === 'hero' && sec.imageUrl === undefined && logoUrl) {
      sec.imageUrl = logoUrl;
      sec.imageAlt = brandName;
    }

    // Footer: inject brand logo only if not already set
    if (sec.type === 'footer') {
      if (logoUrl && sec.logoUrl === undefined) sec.logoUrl = logoUrl;
      if (!sec.logoAlt) sec.logoAlt = brandName;
    }

    // CTA / announcement / image-text: replace placeholder # with real website
    if (
      websiteUrl &&
      (sec.type === 'cta' || sec.type === 'announcement' || sec.type === 'image-text')
    ) {
      if (!sec.buttonUrl || sec.buttonUrl === '#') sec.buttonUrl = websiteUrl;
    }

    return sec;
  });

  // Build section elements
  const sectionElements = processedSections
    .map(s => renderSection(s, config, primaryColor, secondaryColor))
    .filter((el): el is React.ReactElement => el !== null);

  // Build full email element
  const emailElement = React.createElement(
    Html, { lang: 'en' },
    React.createElement(Head, null,
      React.createElement('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      }),
      React.createElement('link', {
        href: config.googleFontsUrl,
        rel: 'stylesheet',
      }),
      React.createElement('style', null,
        '@media only screen and (max-width:620px){' +
        '.em-wrap{width:100%!important;padding:0 20px!important;border-left:none!important;border-right:none!important;border-radius:0!important;box-sizing:border-box!important}' +
        '.em-col{display:block!important;width:100%!important;max-width:100%!important;padding-left:0!important;padding-right:0!important;box-sizing:border-box!important;margin-bottom:12px!important}' +
        'h1{font-size:26px!important;line-height:1.25!important}' +
        'h2{font-size:20px!important;line-height:1.3!important}' +
        'img{max-width:100%!important;height:auto!important}' +
        '.em-logo{height:32px!important;max-width:120px!important;width:auto!important}' +
        '.em-btn{display:block!important;width:100%!important;text-align:center!important;box-sizing:border-box!important}' +
        '}'
      )
    ),
    React.createElement(Preview, null, email.previewText),
    React.createElement(Body, {
      style: {
        backgroundColor: config.bodyBg,
        margin: '0',
        padding: '20px 0',
        fontFamily: config.fontFamily,
      }
    },
      React.createElement(Container, {
        className: 'em-wrap',
        style: {
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: config.bodyBg,
          border: config.containerBorder,
          borderRadius: config.borderRadius,
          overflow: 'hidden',
          padding: '0 32px',
        }
      },
        ...sectionElements
      )
    )
  );

  const html = await render(emailElement);

  // Generate readable React code string (for display/export)
  const reactCode = generateReactCodeString(email, designStyle, brandName, primaryColor);

  return { html, reactCode };
}

// ─────────────────────────────────────────────
// Generate human-readable TSX code string
// ─────────────────────────────────────────────

function generateReactCodeString(
  email: GeneratedEmail,
  designStyle: string,
  brandName: string,
  primaryColor: string
): string {
  const sectionCode = email.sections.map(s => {
    switch (s.type) {
      case 'hero':
        return `  <Section style={{ textAlign: 'center', padding: '40px 0' }}>
    ${s.imageUrl ? `<Img src="${s.imageUrl}" alt="${s.imageAlt || ''}" width="600" style={{ width: '100%' }} />` : ''}
    ${s.heading ? `<Heading as="h1" style={{ fontSize: '36px', fontWeight: '900' }}>${s.heading}</Heading>` : ''}
    ${s.subheading ? `<Text style={{ fontSize: '18px' }}>${s.subheading}</Text>` : ''}
  </Section>`;
      case 'content':
        return `  <Section style={{ padding: '24px 0' }}>
    ${s.heading ? `<Heading as="h2" style={{ fontSize: '24px' }}>${s.heading}</Heading>` : ''}
    ${s.text ? `<Text style={{ lineHeight: '1.7' }}>${s.text}</Text>` : ''}
  </Section>`;
      case 'cta':
        return `  <Section style={{ textAlign: 'center', padding: '32px 0' }}>
    ${s.heading ? `<Heading as="h2">${s.heading}</Heading>` : ''}
    ${s.text ? `<Text>${s.text}</Text>` : ''}
    ${s.buttonText ? `<Button href="${s.buttonUrl || '#'}" style={{ backgroundColor: '${primaryColor}', color: '#fff', padding: '14px 32px' }}>${s.buttonText}</Button>` : ''}
  </Section>`;
      case 'footer':
        return `  <Section style={{ textAlign: 'center', padding: '24px 0' }}>
    <Hr />
    <Text style={{ fontSize: '12px', color: '#999' }}>${s.text || ''}</Text>
  </Section>`;
      default:
        return `  {/* ${s.type} section */}`;
    }
  }).join('\n\n');

  return `import { Html, Head, Body, Preview, Container, Section, Heading, Text, Button, Img, Hr, Font } from '@react-email/components';

// Design Style: ${designStyle} | Brand: ${brandName}
// Generated by Emlet on ${new Date().toISOString().split('T')[0]}

export default function EmailTemplate() {
  return (
    <Html lang="en">
      <Head />
      <Preview>${email.previewText}</Preview>
      <Body style={{ backgroundColor: '#f9f9f9', padding: '20px 0' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff' }}>

${sectionCode}

        </Container>
      </Body>
    </Html>
  );
}
`;
}
