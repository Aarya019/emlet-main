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
  Font,
} from '@react-email/components';
import type { GeneratedEmail, EmailSection } from '@/lib/ai/gemini';
import type { BrandProfile } from '@/lib/db/types';

// ─────────────────────────────────────────────
// Style definitions per design style
// ─────────────────────────────────────────────

interface StyleConfig {
  fontFamily: string;
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
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
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
    fontFamily: "'Georgia', 'Times New Roman', serif",
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
    fontFamily: "'Georgia', 'Courier New', monospace",
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
    fontFamily: "'Arial Black', 'Helvetica', Arial, sans-serif",
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
    fontFamily: "'Courier New', 'Courier', monospace",
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
    fontFamily: "'Georgia', 'Palatino', serif",
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
    fontFamily: "'Arial', 'Helvetica', sans-serif",
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
            fontFamily: config.fontFamily,
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
            fontFamily: config.fontFamily,
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

function renderTestimonial(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: config.sectionPadding }
  },
    React.createElement('div', {
      style: {
        ...config.cardStyle,
        textAlign: 'center' as const,
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
            fontFamily: config.fontFamily,
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
            fontFamily: config.fontFamily,
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
            fontFamily: config.fontFamily,
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
            fontFamily: config.fontFamily,
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
              fontFamily: config.fontFamily,
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
            fontFamily: config.fontFamily,
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

function renderFooter(section: EmailSection, config: StyleConfig): React.ReactElement {
  return React.createElement(Section, {
    style: { padding: '24px 0 16px 0', textAlign: 'center' as const }
  },
    React.createElement(Hr, { style: config.hrStyle }),
    React.createElement(Text, {
      style: {
        fontFamily: config.fontFamily,
        fontSize: '12px',
        color: config.bodyColor + '66',
        lineHeight: '1.6',
        margin: '0',
      }
    }, section.text || '')
  );
}

function renderHeader(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
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
              style: { height: '40px', display: 'block' }
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
                color: config.bodyColor + '88',
                margin: '0',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
              }
            }, section.tagline)
          )
        : null
    )
  );
}

function renderImageText(section: EmailSection, config: StyleConfig, primaryColor: string): React.ReactElement {
  const isLeft = section.imagePosition !== 'right';

  const imageCol = React.createElement(Column, {
    style: {
      width: '45%',
      verticalAlign: 'middle' as const,
      paddingRight: isLeft ? '20px' : '0',
      paddingLeft: isLeft ? '0' : '20px',
    }
  },
    React.createElement(Img, {
      src: section.imageUrl || 'https://placehold.co/260x200',
      alt: section.imageAlt || '',
      width: '260',
      style: { width: '100%', borderRadius: config.borderRadius, display: 'block' }
    })
  );

  const textCol = React.createElement(Column, {
    style: { width: '55%', verticalAlign: 'middle' as const }
  },
    section.heading
      ? React.createElement(Heading, {
          as: 'h2',
          style: {
            fontFamily: config.fontFamily,
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
    React.createElement(Row, null,
      ...(isLeft ? [imageCol, textCol] : [textCol, imageCol])
    )
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
    React.createElement(Row, null,
      ...links.map((link, i) =>
        React.createElement(Column, {
          key: i,
          style: { textAlign: 'center' as const, padding: '0 8px' }
        },
          React.createElement(Link, {
            href: link.url,
            style: {
              color: primaryColor,
              textDecoration: 'none',
              fontFamily: config.fontFamily,
              fontSize: link.icon ? '22px' : '12px',
              fontWeight: link.icon ? '400' : '700',
            }
          }, link.icon || link.platform)
        )
      )
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
            fontFamily: config.fontFamily,
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
  primaryColor: string
): React.ReactElement | null {
  switch (section.type) {
    case 'header':        return renderHeader(section, config, primaryColor);
    case 'hero':          return renderHero(section, config, primaryColor);
    case 'content':       return renderContent(section, config);
    case 'testimonial':   return renderTestimonial(section, config, primaryColor);
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
    case 'footer':        return renderFooter(section, config);
    default:              return null;
  }
}

export async function generateEmailHtml(
  email: GeneratedEmail,
  designStyle: string,
  brandProfile: BrandProfile | null
): Promise<{ html: string; reactCode: string }> {
  const config = styleConfigs[designStyle] || styleConfigs.minimalist;
  const primaryColor = brandProfile?.primary_color || '#5c5cf0';
  const brandName = brandProfile?.brand_name || 'Company';

  // Build section elements
  const sectionElements = email.sections
    .map(s => renderSection(s, config, primaryColor))
    .filter((el): el is React.ReactElement => el !== null);

  // Build full email element
  const emailElement = React.createElement(
    Html, { lang: 'en' },
    React.createElement(Head, null,
      React.createElement(Font, {
        fontFamily: 'Inter',
        fallbackFontFamily: 'Arial',
        webFont: {
          url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
          format: 'woff2',
        },
        fontWeight: 400,
        fontStyle: 'normal',
      })
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
