export interface EventMessage<T> {
  Data: T;
  Type: string;
}

export class GetClickedElementEventMessage implements EventMessage<{}> {
  Data: {};
  Type: string;
  static TYPE: string = "get-clicked-element";
  constructor() {
    this.Data = {};
    this.Type = GetClickedElementEventMessage.TYPE;
  }
}
export class SendClickedElementEventMessage
  implements
    EventMessage<{
      XPath: string;
      Element: any;
    }>
{
  Data: { XPath: string; Element: any };
  Type: string;
  static TYPE: string = "send-clicked-element";
  constructor(xpath: string, element: any) {
    this.Data = {
      Element: element,
      XPath: xpath,
    };
    this.Type = SendClickedElementEventMessage.TYPE;
    this.Data.Element = element;
  }
}

export class ElementFocusEventMessage
  implements
    EventMessage<{
      XPath: string;
    }>
{
  Type: string;
  Data: { XPath: string };
  static TYPE: string = "focus-element";

  constructor(xpath: string) {
    this.Data = {
      XPath: xpath,
    };
    this.Type = ElementFocusEventMessage.TYPE;
  }
}
