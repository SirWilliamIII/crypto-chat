const socket = io();

socket.on("connect", function () {
  const params = deparam(window.location.search);

  function deparam(queryString) {
    const params = {};
    const pairs = queryString.slice(1).split("&");
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split("=");
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1] || "");
      params[key] = value;
    }
    return params;
  }

  socket.emit("join", params, (err, data) => {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function () {
  console.log("Disconnected from server");
});

socket.on("newMessage", function (message) {
  console.log("New message", message);
  const li = document.createElement("li");
  li.textContent = `${message.from}: ${message.text}`;
  document.getElementById("messages").appendChild(li);
});
document
  .getElementById("message-form")
  .addEventListener("submit", function (evt) {
    evt.preventDefault();
    socket.emit(
      "createMessage",
      {
        from: "User",
        text: document.querySelector("[name=message]").value,
      },
      function () {}
    );
  });
