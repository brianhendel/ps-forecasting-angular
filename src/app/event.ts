// For a full list of fields, see
// https://docs.microsoft.com/graph/api/resources/event?view=graph-rest-1.0
export class Event {
    subject: string;
    organizer: Recipient;
    start: DateTimeTimeZone;
    end: DateTimeTimeZone;
    categories: string[];
    duration: number;
  }
  
  // https://docs.microsoft.com/graph/api/resources/recipient?view=graph-rest-1.0
  export class Recipient {
    emailAddress: EmailAddress;
  }
  
  // https://docs.microsoft.com/graph/api/resources/emailaddress?view=graph-rest-1.0
  export class EmailAddress {
    name: string;
    address: string;
  }
  
  // https://docs.microsoft.com/graph/api/resources/datetimetimezone?view=graph-rest-1.0
  export class DateTimeTimeZone {
    dateTime: string;
    timeZone: string;
  }

  export class EventHolder {
    name: string;
    eventArray: Event[];
  }

  export class ReportRow {
    name: string;
    result: number[]
  }

  export class ReportArray {
    reportData: ReportRow[];
  }