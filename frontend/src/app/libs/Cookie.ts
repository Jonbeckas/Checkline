export class Cookie {
  static getCookie(name) {
    let cookies = document.cookie.split("; ");
    let answer;
    cookies.forEach(function (element) {
      let items = element.split("=");
      if(name === items[0]) {
        answer = items[1];
      }
    });
    return answer;
  }

  static setInfinityCookie(name,value) {
    let date = new Date().getFullYear()+9999;
    document.cookie = name+"="+value+";path=/; expires=Fri, 31 Dec "+date+" 23:59:59 GMT";
  }
  static removeCookie(name) {
    let date = new Date().getFullYear();
    if (date <=999) {
      date = 0;
    }
    date = date-999;
    document.cookie= name+"=;path=/; expires=Thu, 01 Jan "+date+" 00:00:01 GMT;";
  }

  static removeCookies() {
    let cookies = document.cookie.split("; ");
    let date = new Date().getFullYear();
    if (date <=999) {
      date = 0;
    }
    date = date-999;
    cookies.forEach(function (element) {
      let items = element.split("=");
      document.cookie= items[0]+"=;path=/; expires=Thu, 01 Jan "+date+" 00:00:01 GMT;";
    });
  }
  static editcookie(name,value) {
    this.removeCookie(name);
    this.setInfinityCookie(name,value);
  }


}

