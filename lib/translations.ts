export type Lang = "fr" | "en";

export const translations = {
  fr: {
    nav: {
      portfolio: "PORTFOLIO",
      about: "À PROPOS",
      contact: "CONTACT",
    },
    categories: {
      all: "TOUT",
      ads: "PUBS & BRAND CONTENT",
      docs: "ÉMISSIONS & DOCS",
      trailers: "BANDES-ANNONCES",
      fiction: "FICTIONS",
    },
    about: {
      title: "À PROPOS",
      bio: "Monteur vidéo basé à Paris avec plus de 9 ans d'expérience.\nJe collabore avec des agences, des productions indépendantes et institutions, aussi bien pour la télévision que pour le web.\nDu brand content rythmé au documentaire d'investigation, j'adapte ma narration aux codes de chaque format.",
    },
    contact: {
      title: "CONTACT",
      orEmail: "Ou directement par email :",
    },
    footer: {
      rights: "Tous droits réservés.",
    },
    form: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      message: "Message",
      messagePlaceholder: "Votre message...",
      send: "Envoyer",
      sending: "Envoi en cours...",
      successTitle: "Message envoyé avec succès !",
      successSub: "Je vous répondrai dans les plus brefs délais.",
      sendAnother: "Envoyer un autre message",
      errorConnection: "Erreur de connexion. Veuillez réessayer.",
      errorDefault: "Une erreur est survenue.",
    },
    noVideos: "Aucune vidéo trouvée dans cette catégorie.",
  },
  en: {
    nav: {
      portfolio: "PORTFOLIO",
      about: "ABOUT",
      contact: "CONTACT",
    },
    categories: {
      all: "ALL",
      ads: "ADS & BRAND CONTENT",
      docs: "SHOWS & DOCS",
      trailers: "TRAILERS",
      fiction: "FICTION",
    },
    about: {
      title: "ABOUT",
      bio: "Paris-based video editor with over 9 years of experience.\nI collaborate with agencies, independent productions, and institutions, for both television and the web.\nFrom punchy brand content to investigative documentaries, I adapt my storytelling to the codes of each format.",
    },
    contact: {
      title: "CONTACT",
      orEmail: "Or directly by email:",
    },
    footer: {
      rights: "All rights reserved.",
    },
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      message: "Message",
      messagePlaceholder: "Your message...",
      send: "Send",
      sending: "Sending...",
      successTitle: "Message sent successfully!",
      successSub: "I will get back to you as soon as possible.",
      sendAnother: "Send another message",
      errorConnection: "Connection error. Please try again.",
      errorDefault: "An error occurred.",
    },
    noVideos: "No videos found in this category.",
  },
} as const;
