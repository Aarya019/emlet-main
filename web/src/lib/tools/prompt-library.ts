/**
 * Prompts for writing emails with AI. Each is a complete brief: who it is for, what to include, the tone and
 * the one action, with [bracketed] gaps to fill. They work in any AI tool; in Emlet they also become a designed email.
 */

export interface PromptCategory {
  id: string;
  label: string;
}

export interface EmailPrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'launch', label: 'Launches' },
  { id: 'event', label: 'Events' },
  { id: 'sale', label: 'Sales' },
  { id: 'newsletter', label: 'Newsletters' },
  { id: 'cart', label: 'Carts and stock' },
  { id: 'winback', label: 'Win-back' },
  { id: 'transactional', label: 'Order and account' },
  { id: 'feedback', label: 'Reviews and feedback' },
  { id: 'announcement', label: 'Announcements' },
  { id: 'saas', label: 'SaaS' },
  { id: 'seasonal', label: 'Seasonal' },
];

export const EMAIL_PROMPTS: EmailPrompt[] = [
  // Welcome
  {
    id: 'welcome-small-shop',
    category: 'welcome',
    title: 'Welcome email for a small shop',
    prompt:
      "Write a warm welcome email for new subscribers to [shop name], an independent [type of shop] in [city]. Say what they will get from the list (one email a week, early access to new arrivals), introduce the person behind the shop in two sentences, and end with one button to browse this week's new arrivals. Friendly and a little dry, never salesy.",
  },
  {
    id: 'welcome-first-order-discount',
    category: 'welcome',
    title: 'Welcome with a first-order discount',
    prompt:
      "Write a welcome email for [brand name] that delivers a 10% first-order discount with the code [CODE], valid for 14 days. Open with a thank-you, explain in one line what makes [brand name] different, show three bestsellers, and finish with a single 'Shop now' button. Short and easy to skim on a phone.",
  },
  {
    id: 'welcome-newsletter',
    category: 'welcome',
    title: 'Welcome to a newsletter',
    prompt:
      "Write a welcome email for new readers of [newsletter name], a weekly newsletter about [topic]. Confirm what they signed up for and when it arrives, link to the three best past issues, and invite them to reply with one question about [topic]. First person and conversational.",
  },
  {
    id: 'welcome-community',
    category: 'welcome',
    title: 'Welcome to a club or community',
    prompt:
      "Write a welcome email for a new member of [club or community name]. Explain how it works in three short steps, point to the next event on [date], and tell them how to introduce themselves. Warm and inclusive, with one button to RSVP.",
  },

  // Launches
  {
    id: 'launch-announcement',
    category: 'launch',
    title: 'Product launch announcement',
    prompt:
      "Write a launch announcement for [product name], a new [type of product] for [audience]. Lead with the problem it solves, show the three most useful features with a one-line benefit each, include the price of [price] and the launch offer that ends on [date], and finish with one button to [buy or reserve]. Confident, plain language, no hype words.",
  },
  {
    id: 'launch-teaser',
    category: 'launch',
    title: 'Teaser before a launch',
    prompt:
      "Write a short teaser email, sent a few days before we launch [product name] on [date]. Do not reveal the price. Tell the story of why we made it in a few sentences, give one concrete detail people can picture, and invite them to join the early-access list with one button.",
  },
  {
    id: 'launch-limited-run',
    category: 'launch',
    title: 'Limited run or pre-order',
    prompt:
      "Write an email announcing a limited run of [number] [product]. Explain why it is limited, what is special about this batch, the pre-order deadline of [date], when it ships, and one button to pre-order. Honest urgency only, no fake countdown.",
  },
  {
    id: 'launch-new-collection',
    category: 'launch',
    title: 'New collection',
    prompt:
      "Write an email introducing our new [season] collection from [brand name]. Open with a short, vivid description of the mood, feature four hero items with their prices, and add one line about the materials or how it is made. One button: See the collection.",
  },

  // Events
  {
    id: 'event-invitation',
    category: 'event',
    title: 'Gig or listening night invitation',
    prompt:
      "Write an invitation to [event name] at [venue] on [date and time]. Cover what it is in one line, what to expect, the price of [price] or free, the capacity of [number] seats, and one button to reserve a seat. Make the date, place and price impossible to miss near the top.",
  },
  {
    id: 'event-workshop',
    category: 'event',
    title: 'Workshop or class',
    prompt:
      "Write an email inviting people to our [workshop name], a [length]-hour workshop on [topic] on [date] at [location or online]. Say who it is for, what they will make or learn, what to bring, the cost, and how many places are left. One button to book.",
  },
  {
    id: 'event-reminder',
    category: 'event',
    title: 'Reminder the day before',
    prompt:
      "Write a short reminder email for tomorrow's [event name] at [venue], doors at [time]. Include the address and how to get there, anything to bring, what happens at the door, and a line for anyone who can no longer come. Practical and friendly, no marketing language.",
  },
  {
    id: 'event-thank-you',
    category: 'event',
    title: 'Thank you after an event',
    prompt:
      "Write a thank-you email for people who came to [event name] last night. Share two highlights, link to [photos or the recording], mention what is coming next on [date], and ask one question about what they would like to see at the next one.",
  },

  // Sales
  {
    id: 'sale-seasonal',
    category: 'sale',
    title: 'Seasonal sale',
    prompt:
      "Write a sale email for [brand name]: [percentage] off [category] until [date]. Lead with exactly what is on sale and for how long, show four of the best items with prices, mention the shipping cut-off for delivery by [date], and finish with one button. Straightforward, no all-caps and no exclamation marks.",
  },
  {
    id: 'sale-early-access',
    category: 'sale',
    title: 'Early access for subscribers',
    prompt:
      "Write an early-access email for our subscribers, giving them the [event name] sale 24 hours before everyone else. Explain the offer, the exact start time of [time], and the code [CODE]. Warm thank-you tone for being on the list.",
  },
  {
    id: 'sale-last-chance',
    category: 'sale',
    title: 'Last chance, ends tonight',
    prompt:
      "Write a short last-chance email for our [offer] that ends tonight at [time]. One headline with the offer, one line on what happens when it ends, and a single button. Only mention things that are true.",
  },
  {
    id: 'sale-bundle',
    category: 'sale',
    title: 'Bundle offer',
    prompt:
      "Write an email promoting our [bundle name], which includes [items] for [price], a saving of [amount] compared with buying them separately. Explain who it suits, what is in the bundle, and add one button. Calm and helpful, no pressure.",
  },

  // Newsletters
  {
    id: 'newsletter-three-stories',
    category: 'newsletter',
    title: 'Weekly newsletter with three stories',
    prompt:
      "Write this week's issue of [newsletter name] for [audience]. Include a short personal opening, three stories on [topic 1], [topic 2] and [topic 3] with two sentences and a link each, one thing we are reading or listening to, and a friendly sign-off. Editorial style with plenty of white space.",
  },
  {
    id: 'newsletter-monthly-update',
    category: 'newsletter',
    title: 'Monthly update from a small business',
    prompt:
      "Write a monthly update email from [business name]: what we made or sold this month, one customer story, one behind-the-scenes detail, and what is coming next month. Personal and honest, about 200 words.",
  },
  {
    id: 'newsletter-roundup',
    category: 'newsletter',
    title: 'Curated roundup',
    prompt:
      "Write a roundup email of the five best [things, such as new releases, articles or products] this [week or month] in [niche], each with a one-line reason to care and a link. Open with a sentence on what connects them.",
  },
  {
    id: 'newsletter-how-to',
    category: 'newsletter',
    title: 'Educational how-to email',
    prompt:
      "Write an educational email teaching [audience] how to [skill or task] in four steps. Start with who this is for and what they will be able to do after reading, keep each step to two sentences, and end with one button to [next step or resource].",
  },

  // Carts and stock
  {
    id: 'cart-reminder',
    category: 'cart',
    title: 'Abandoned cart reminder',
    prompt:
      "Write a friendly abandoned-cart email for [brand name]. Remind them what they left behind, show the items with pictures and prices, answer the two questions people usually have before buying (shipping time and returns), and add one button to return to their cart. No guilt and no countdown.",
  },
  {
    id: 'cart-incentive',
    category: 'cart',
    title: 'Second cart email with free shipping',
    prompt:
      "Write a second abandoned-cart email, sent 48 hours after the first, offering free shipping on orders over [amount] with the code [CODE] for the next three days. Short and polite, with the items they left and one button.",
  },
  {
    id: 'cart-back-in-stock',
    category: 'cart',
    title: 'Back in stock',
    prompt:
      "Write a back-in-stock email for [product name], which sold out on [date] and is available again. Say how many we have and when we expect to run out, and add one button to buy. A touch of relief and humour is welcome.",
  },
  {
    id: 'cart-price-drop',
    category: 'cart',
    title: 'Price drop alert',
    prompt:
      "Write a price-drop email for [product name], now [new price] (was [old price]) until [date]. Remind them why people like it in one line and add one button.",
  },

  // Win-back
  {
    id: 'winback-we-miss-you',
    category: 'winback',
    title: 'We miss you',
    prompt:
      "Write a win-back email for customers who have not bought from [brand name] in [number] months. Acknowledge the gap, share what is new since they last visited, offer [incentive] with the code [CODE] valid for [number] days, and give them an easy way to unsubscribe if they would rather not hear from us.",
  },
  {
    id: 'winback-before-pruning',
    category: 'winback',
    title: 'Re-engagement before pruning the list',
    prompt:
      "Write a polite re-engagement email to subscribers who have not opened our emails in [number] months. Ask if they still want to hear from us, give them a one-click 'Yes, keep me on the list' button, and say plainly that we will remove them if we do not hear back by [date].",
  },
  {
    id: 'winback-cancelled',
    category: 'winback',
    title: 'After a cancellation',
    prompt:
      "Write an email for someone who just cancelled their [subscription name] subscription. Thank them without guilt, confirm what happens to their account until [date], tell them how to come back, and ask a single optional question about why they left.",
  },

  // Order and account
  {
    id: 'transactional-order-confirmation',
    category: 'transactional',
    title: 'Order confirmation',
    prompt:
      "Write an order confirmation email for [brand name]. Include the order number [number], an itemised summary with prices, the shipping address, the expected delivery date, and a link to track the order. Clear and calm, with no marketing in it.",
  },
  {
    id: 'transactional-shipping',
    category: 'transactional',
    title: 'Shipping notification',
    prompt:
      "Write a shipping notification email: order [number] has shipped with [carrier], tracking number [tracking], expected delivery [date]. Add a short note on what to do if it does not arrive, and one button to track the parcel.",
  },
  {
    id: 'transactional-password-reset',
    category: 'transactional',
    title: 'Password reset',
    prompt:
      "Write a password reset email for [product name]. Explain that a reset was requested, give one button that expires in [number] hours, and say what to do if they did not ask for it. Short, plain and reassuring.",
  },
  {
    id: 'transactional-receipt',
    category: 'transactional',
    title: 'Receipt or invoice',
    prompt:
      "Write a receipt email for a payment of [amount] to [business name] for [product or service] on [date]. Include the invoice number, the payment method (last four digits), a billing summary, and a link to download the invoice.",
  },

  // Reviews and feedback
  {
    id: 'feedback-review-request',
    category: 'feedback',
    title: 'Review request',
    prompt:
      "Write an email asking a customer to review [product name] about [number] days after delivery. Thank them, ask one specific question about how it is going, and add a button to leave a review. Make it feel like it comes from a person.",
  },
  {
    id: 'feedback-survey',
    category: 'feedback',
    title: 'Two-minute survey',
    prompt:
      "Write an email inviting customers to a two-minute survey about [topic], with [reward, such as a 10% discount] for completing it. Say exactly how long it takes and how their answers will be used, and add one button.",
  },
  {
    id: 'feedback-testimonial',
    category: 'feedback',
    title: 'Testimonial request',
    prompt:
      "Write a short email asking a happy customer if we can quote their kind words about [product or service] on our website. Include their original message, make it easy to say yes or no, and thank them either way.",
  },

  // Announcements
  {
    id: 'announcement-hours-location',
    category: 'announcement',
    title: 'New opening hours or location',
    prompt:
      "Write an email announcing that [business name] is changing its [opening hours or location] from [date]. State the change first, then the reason in one sentence, the new details, and how to reach us. Add a map link or one button.",
  },
  {
    id: 'announcement-price-change',
    category: 'announcement',
    title: 'Price change, honestly',
    prompt:
      "Write an honest email telling customers our prices on [product or plan] are changing from [date], from [old price] to [new price]. Explain why in two sentences, say what stays the same, and tell existing customers how long they keep their current price.",
  },
  {
    id: 'announcement-milestone',
    category: 'announcement',
    title: 'Milestone and thank you',
    prompt:
      "Write a short thank-you email celebrating [milestone, such as five years in business]. Tell the story in three short paragraphs, thank customers, and include one small gift: [gift or discount].",
  },

  // SaaS
  {
    id: 'saas-onboarding',
    category: 'saas',
    title: 'Day-one onboarding',
    prompt:
      "Write a day-one onboarding email for new users of [product name], a [one-line description]. Give them one quick win they can complete in five minutes, link straight to it with one button, and offer help through [support channel]. Friendly and direct, no feature tour.",
  },
  {
    id: 'saas-trial-ending',
    category: 'saas',
    title: 'Trial ending',
    prompt:
      "Write an email telling a user their [product name] free trial ends in [number] days. Remind them of what they have set up so far, explain what changes if they do nothing, show the plan price of [price], and add one button to upgrade.",
  },
  {
    id: 'saas-feature-announcement',
    category: 'saas',
    title: 'Feature announcement',
    prompt:
      "Write a product update email about [feature name]. Explain the problem it solves, show how to use it in three steps, say who gets it (all plans or [plan]), and add one button to try it now.",
  },
  {
    id: 'saas-inactive-users',
    category: 'saas',
    title: 'Nudge for inactive users',
    prompt:
      "Write an email for users who signed up for [product name] but have not logged in for [number] days. Mention the one thing most new users do next, link to it, and invite them to reply if they are stuck.",
  },

  // Seasonal
  {
    id: 'seasonal-holiday-greeting',
    category: 'seasonal',
    title: 'Holiday greeting with no sale',
    prompt:
      "Write a warm holiday greeting from [brand name] with no sale in it. Thank customers for the year, share the dates we are closed and the last shipping dates of [dates], and send good wishes.",
  },
  {
    id: 'seasonal-gift-guide',
    category: 'seasonal',
    title: 'Gift guide',
    prompt:
      "Write a gift-guide email for [occasion] with [number] ideas at three price points (under [amount 1], under [amount 2] and a splurge), a one-line reason for each, and the last order date for delivery in time of [date].",
  },
  {
    id: 'seasonal-occasion',
    category: 'seasonal',
    title: 'Occasion email (Mother\'s Day, Valentine\'s and similar)',
    prompt:
      "Write an email for [occasion] from [brand name] with a collection of four gift ideas, a sentence on how to choose, the last order date for delivery by [date], and one button.",
  },
  {
    id: 'seasonal-new-year',
    category: 'seasonal',
    title: 'New year, fresh start',
    prompt:
      "Write a new-year email from [brand name] about starting [the year or season] well. Share three small, realistic ideas related to [what we sell or teach], one of ours that helps, and a single button. Encouraging, not preachy.",
  },
];

/** Placeholders like [shop name] that the user should replace before using a prompt. */
export function countPlaceholders(prompt: string): number {
  return (prompt.match(/\[[^\]]+\]/g) ?? []).length;
}

export function promptsMatching(query: string, category: string | null): EmailPrompt[] {
  const q = query.trim().toLowerCase();
  return EMAIL_PROMPTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (!q) return true;
    return p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
  });
}
