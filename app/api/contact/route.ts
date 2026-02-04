import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jean Lanot Portfolio <contact@portfolio.jeanlanot.com>", // ✅ Ton domaine vérifié
        to: "contact@portfolio.jeanlanot.com", // ✅ Ton adresse perso où tu reçois
        subject: `Nouveau message de ${name}`,
        reply_to: email, // ✅ Parfait pour répondre directement au visiteur
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi du message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
