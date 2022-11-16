const e = require("express");
const express = require("express");
const { Telegraf, Markup } = require("telegraf");
const db = require("../db");

const token = '5708802519:AAF_ZaNmo4tgexx2YQdNNaxBqUHjuwpBWcg' // токен основного бота

//const token = "5671279982:AAHBixYOEnmGJLv6xkVDLrQlVNFDnLUB7PY"; // Мой токен
let nprChatID;

// const token = "5755766246:AAHB8VeAhwN8Qns3V8wtuXyz4G20OvHZiuY"; // Арти
// const nprChatID = "200094164"; // Арти

class MainPageController {
  async GetData(req, res) {
    try {
      console.log(req.body);
      if (req.body.nprChatID === 'null') {
        nprChatID = "200094164";
      } else {
        nprChatID = req.body.nprChatID;
      }
      console.log(nprChatID);
      let oprder_id;

      await db.connect((err) => {
        if (err) {
          return console.log("Ошибка подключения к БД: " + err);
        } else {
          db.query(
            `INSERT INTO \`birthdays\`(\`Фамилия\`, \`Имя\`, \`Отчество\`, \`Дата\`) VALUES ('${req.body.secondName}','${req.body.firstName}','${req.body.patronymic}','${req.body.birthday}')`,
            (err, rows, fields) => {
              if (err) {
                console.log(err);
                //db.end();
              } else {
                //res.send(rows);
                db.query(`SELECT LAST_INSERT_ID();`, (err, rows, fields) => {
                  if (err) {
                    console.log(err);
                    //db.end();
                  } else {
                    const id_birthdays = rows[0]["LAST_INSERT_ID()"];
                    console.log("id_birthdays " + id_birthdays);
                    db.query(
                      `INSERT INTO \`orders\` (\`text\`, \`publication_date\`, \`npr_id\`, \`chat_id\`, \`status\`, \`offsprings\`, \`birthdays_id\`, \`number\`, \`village\`) VALUES ('${req.body.congrats}','${req.body.publishionDate}','${req.body.nprID}','${nprChatID}','${req.body.status}','${req.body.offspring}','${id_birthdays}','${req.body.number}','${req.body.village}')`,
                      (err, rows, fields) => {
                        if (err) {
                          console.log(err);
                          //db.end();
                        } else {
                          //res.send(rows);
                          //console.log("Ордер успешно добавлен");
                          db.query(
                            `SELECT LAST_INSERT_ID();`,
                            (err, rows, fields) => {
                              if (err) {
                                console.log(err);
                              } else {
                                oprder_id = rows[0]["LAST_INSERT_ID()"];
                                //console.log("oprder_id " + oprder_id);
                                console.log("nprChatID " + nprChatID);
                                sendMessageFunc(
                                  oprder_id,
                                  req.files.myFile.data, // Получаемый файл (картинка)
                                  req.body,
                                  nprChatID
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            }
          );

          // return console.log("Успешно подключились БД");
        }
        //db.end();
      });

      res.send("ok");
    } catch (error) {
      res.send("error" + error);
    }
  }

  GetAllLocations(req, res) {
    let result = db.query("SELECT * FROM `npr`", (err, rows, fields) => {
      if (err) {
        console.log(err);
        db.end();
      } else {
        // console.log(rows);
        res.send(rows);
        // db.end();
      }
    });
  }
}

// Функции ---------------------------------------------------------------------------------------------------

async function sendMessageFunc(oprder_id, picture, reqBody, nprChatID) {
  const fileContent =
    "Населенный пункт: " +
    reqBody.village +
    "\n\nФИО: " +
    reqBody.secondName +
    " " +
    reqBody.firstName +
    " " +
    reqBody.patronymic +
    "\n\nДень рождения: " +
    reqBody.birthday +
    "\n\nСтатус: " +
    reqBody.status +
    "\n\nНомер: " +
    reqBody.number +
    "\n\nПоздравитель: " +
    reqBody.offspring +
    "\n\nТекст: " +
    reqBody.congrats;

  const bot = new Telegraf(token);

  let fileBuffer = Buffer.alloc(fileContent.length * 4); // Создаем буфферный файл, размер (в байтах) которого равен кол-ву символову умноженное на 4. Т.к. размер каждого символа UTF-8 равен от 1 до 4 байт

  fileBuffer.write(fileContent, "utf-8");

  await bot.telegram
    .sendMediaGroup(nprChatID, [
      {
        type: "document",
        media: {
          source: picture,
          filename: `photo_${oprder_id}.jpg`,
        },
      },
      {
        type: "document",
        media: {
          source: fileBuffer,
          filename: `info_${oprder_id}.txt`,
        },
        caption: `*#order${oprder_id}*\n\n*Редакция:* ${reqBody.nprName} \n\n*Дата публикации:*\n${reqBody.publishionDate}\n\n*Предположительная стоимость:* ${reqBody.price}`,
        parse_mode: "Markdown",
      },
    ])
    .catch((err) => {
      console.log(err);
    });

  bot.telegram
    .sendMessage(
      nprChatID,
      `*#order${oprder_id}*\nКакая-то важная информация`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          Markup.button.callback("Принять ✅", "yes"),
          Markup.button.callback("Отклонить ❌", "no"),
        ]),
      }
    )
    .catch((err) => {
      console.log(err);
    });

  fileBuffer = null; // По идее должен освобождать память
}

module.exports = new MainPageController();
