import { React, useState, useEffect } from "react";

import axios from "axios";
import "../styles/MyFirstPage.css";
 const myURL = "http://176.57.215.24:3001/" // Хостинг

// const myURL = "http://192.168.0.36:3001/"
//const myURL = "http://localhost:3001/";

const tg = window.Telegram.WebApp;

function MyFirstPage() {
  const [fio, setFio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [status, setStatus] = useState("");
  const [offspring, setOffspring] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nprName, setNprName] = useState("");
  const [nprID, SetNprID] = useState("");
  const [myLocation, setMyLocation] = useState("");
  const [region, setRegion] = useState("");
  const [congrats, setCongrats] = useState("");
  const [myFile, setMyFile] = useState();
  const [publishionDate, setPublishionDate] = useState("");
  const [nprLocation, setNprLocation] = useState([]);
  const [unicNprLocation, setUnicNprLocation] = useState([]);
  const [nprArray, setNprArray] = useState([]);
  const [personDataCheckBox, SetPersonDataCheckBox] = useState(false);
  const [notificationСheckBox, SetNotificationСheckBox] = useState(false);

  const [selectNprIsDesebled, SetSelectNprIsDesebled] = useState(true);
  const [price, setPrice] = useState("");
  const [isButtonOff, setIsButtonOff] = useState(true);

  async function SendFunc(event) {
    event.preventDefault();
    let fioArray = fio.split(" ");
    if (fio.length === fio.lastIndexOf(" ") + 1 && fioArray !== 3) {
      alert("!!!Ошибка ввода ФИО");
      return;
    }

    console.log(fioArray);

    let myformData = new FormData();

    myformData.append("secondName", fioArray[0]);
    myformData.append("firstName", fioArray[1]);
    myformData.append("patronymic", fioArray[2]);
    myformData.append("birthday", birthday);
    myformData.append("number", phoneNumber);
    myformData.append("village", myLocation + ", " + region);
    myformData.append("status", status);
    myformData.append("offspring", offspring);
    myformData.append("nprName", nprName);
    myformData.append("nprID", nprID);
    myformData.append("congrats", congrats);
    myformData.append("myFile", myFile);
    myformData.append("publishionDate", publishionDate);
    myformData.append("price", price);
    myformData.append("chat_Id", tg.initDataUnsafe.user.id);

    await axios.post(myURL, myformData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  }

  useEffect(() => {
    let count_congrats_words = congrats.split(" ").length - 1;
    if (count_congrats_words.length === 0) setPrice(40 + " руб.");
    else setPrice(count_congrats_words * 40 + " руб.");
  }, [congrats]);

  useEffect(() => {
    let tempArray = [];
    for (let i = 0; i < nprLocation.length; i++) {
      if (nprLocation[i]["location"] === region) {
        tempArray.push(nprLocation[i]);
        SetNprID(nprLocation[i]["npr_id"]);
      }
    }
    setNprArray(tempArray);
    SetSelectNprIsDesebled(region ? false : true);
    tempArray = null;
  }, [region]);

  useEffect(() => {
    axios.get(myURL).then((row) => {
      setNprLocation(row.data);
    });
    console.log('Информация о пользователе');
    console.log(tg.initDataUnsafe);
  }, []);


  // Нахожу не повторяющиеся населенные пункты
  useEffect(() => {
    let tempArr = [];

    for (let i = 0; i < nprLocation.length; i++) {
      if (!tempArr.includes(nprLocation[i]["location"])) {
        tempArr.push(nprLocation[i]["location"]);
      } else {
        continue;
      }
    }
    let tempArr1 = [];
    for (let i = 0; i < nprLocation.length; i++) {
      if (nprLocation[i]["location"] == tempArr[i]) {
        tempArr1.push(nprLocation[i]);
      } else {
        continue;
      }
    }
    setUnicNprLocation(tempArr1);
    tempArr = null;
    tempArr1 = null;

    console.log(unicNprLocation);
  }, [nprLocation]);

  useEffect(() => {
    if (
      fio !== "" &&
      status !== "" &&
      offspring !== "" &&
      nprName !== "" &&
      myLocation !== "" &&
      phoneNumber !== "" &&
      congrats !== "" &&
      publishionDate !== ""
    ) {
      setIsButtonOff(false);
    } else setIsButtonOff(true);
  }, [
    fio,
    status,
    offspring,
    phoneNumber,
    nprName,
    myLocation,
    congrats,
    myFile,
    publishionDate,
  ]);

  return (
    <div className="container">
      <form name="myForm">
        <div className="textDiv">
          <h3>Новое поздравление</h3>
        </div>
        <input
          type="text"
          className="FIOInput"
          value={fio}
          onChange={(e) => {
            setFio(e.target.value);
          }}
          placeholder="Ф.И.О. того, кого хотите поздравить"
        />
        <span className="Example">Например: Иванов Иван Иванович</span>
        <input
          type="date"
          className="DateInput"
          value={birthday}
          onChange={(e) => {
            setBirthday(e.target.value);
          }}
        />
        <span>Выберите дату рождения</span>
        <input
          type="text"
          className="FIOInput"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
          placeholder="Кем для вас является этот человек"
        />
        <span className="Example">Например: мама/папа/дед/бабушка и тд.</span>
        <input
          type="text"
          className="FIOInput"
          value={offspring}
          onChange={(e) => {
            setOffspring(e.target.value);
          }}
          placeholder="Кто поздравляет"
        />
        <span className="Example">Например: дочка/сын/внук/внучка и тд.</span>
        <input
          type="text"
          className="FIOInput"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
          placeholder="Номер телефона"
        />
        <input
          type="text"
          className="FIOInput"
          value={myLocation}
          onChange={(e) => {
            setMyLocation(e.target.value);
          }}
          placeholder="Населенный пункт"
        />
        <select
          className="SelectNPR"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
          }}
        >
          <option hidden={true}>Выберите район</option>
          {unicNprLocation.map((item) => {
            return <option key={item["npr_id"]}>{item["location"]}</option>;
          })}
        </select>
        <select
          className="SelectNPR"
          value={nprName}
          onChange={(e) => {
            setNprName(e.target.value);
          }}
          disabled={selectNprIsDesebled}
        >
          <option hidden={true}>Выберите редакцию</option>
          {nprArray.map((item) => {
            return <option key={item["npr_id"]}>{item["name"]}</option>;
          })}
        </select>
        <textarea
          type="text"
          className="CongratsInput"
          value={congrats}
          onChange={(e) => {
            setCongrats(e.target.value);
          }}
          placeholder="Текст поздравления"
        />
        <input
          type="file"
          accept="image/jpeg"
          className="FileInput"
          onChange={(e) => {
            setMyFile(e.target.files[0]);
          }}
        />
        <span>Выберите дату публикации</span>
        <input
          type="date"
          className="DateInput"
          value={publishionDate}
          onChange={(e) => {
            setPublishionDate(e.target.value);
          }}
        />
        <div className="checkboxDiv">
          <input
            type="checkbox"
            onClick={() => {
              SetPersonDataCheckBox(!personDataCheckBox);
            }}
          />
          <span>Согласие на обработку персональных данных</span>
        </div>
        <div className="checkboxDiv">
          <input
            type="checkbox"
            onClick={() => {
              SetNotificationСheckBox(!notificationСheckBox);
            }}
          />
          <span>
            Согласие на отправку напоминания о предстоящем дне рождения и акциях
            нашей компании
          </span>
        </div>
        <button
          type="submit"
          //disabled={isButtonOff}
          onClick={SendFunc}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}

export default MyFirstPage;
