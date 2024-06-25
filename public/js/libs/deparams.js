(function () {
  window.deparam =
    window.deparam ||
    function (uri) {
      const salt = "will";
      if (uri === undefined) {
        uri = window.location.search;
      }
      const queryString = {};
      uri.replace(
        new RegExp("([^?=&]+)(=([^&#]*))?", "g"),
        function ($0, $1, $2, $3) {
          queryString[$1] = decodeURIComponent($3.replace(/\+/g, "%20"));
        }
      );
      queryString.room += salt;
      return queryString;
    };
})();
