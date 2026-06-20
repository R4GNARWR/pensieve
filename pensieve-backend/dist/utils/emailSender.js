export {};
// export const sendEmail = async (type, to, subject, text) => {
//   try {
//     const response = await fetch(`https://api.mailopost.ru/v1/email/messages/`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.MAILGUN_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from_email: "kirill.asylbaev@gmail.com",
//         from_name: "Pensive",
//         to: "eoyshi@mail.ru",
//         subject: "Тест",
//         text: "Тест",
//       }),
//     });
//     console.log(response)
//   } catch (e) {
//     console.log("Error:", e);
//   }
// };
