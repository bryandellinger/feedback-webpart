import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './FeedbackWebPart.module.scss';
import * as strings from 'FeedbackWebPartStrings';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from '@microsoft/sp-http';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

export interface IFeedbackWebPartProps {
  hintText: string;
}

export default class FeedbackWebPart extends BaseClientSideWebPart<IFeedbackWebPartProps> {

  public render(): void {
    debugger;
    this.domElement.innerHTML = `
    <div>
    <i class='ms-Icon ms-Icon--NoteForward' aria-hidden='true'></i>
    <input type='text' class='${styles.input}' maxlenght='255' placeholder='${escape(this.properties.hintText)}' />
    <button type='button' class='ms-Button'><span class='ms-Button-label'>Send</span></button>
    <p class='${styles.successIndicator}'></p>
  </div>`;
      this.setComment = this.setComment.bind(this);
      this.sendFeedback = this.sendFeedback.bind(this);

      const textInput: HTMLInputElement = 
        this.domElement.getElementsByTagName("INPUT")[0] as HTMLInputElement;
      textInput.addEventListener("keyup", this.setComment);

     const button: HTMLButtonElement =
       this.domElement.getElementsByTagName("BUTTON")[0] as HTMLButtonElement;
      button.onclick = this.sendFeedback;
  }

  private _commentText : string;

  private setComment(event: Event): void{
    debugger;
    let srcElement: HTMLInputElement = event.srcElement as HTMLInputElement;
    this._commentText = escape(srcElement.value);
  } 
  
  private sendFeedback(): void {
    debugger;
    this.context.statusRenderer.clearError(this.domElement);
    const paragraphElement: HTMLParagraphElement =
      this.domElement.getElementsByClassName(styles.successIndicator)[0] as HTMLParagraphElement;
    paragraphElement.innerHTML = "";

    if (this._commentText === undefined || this._commentText.length === 0) {
      this.context.statusRenderer.renderError(this.domElement, "Please type in a comment or suggestion.");
      return;
    }

    if (Environment.type === EnvironmentType.Local) {
      this.context.statusRenderer.renderError(this.domElement, "Feedback can't be saved when running in local workbech.");
      return;
    }
    debugger;
    const url: string = this.context.pageContext.site.absoluteUrl+"/_api/web/lists/getbytitle('Feedback')/items";
    const item : any = {
          "Title": this._commentText,
          "url": window.location.href
    };
    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(item)
    };
    this.context.statusRenderer.displayLoadingIndicator(paragraphElement, "- Sending feedback");
    this.context.spHttpClient.post(url,SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        this.context.statusRenderer.clearLoadingIndicator(paragraphElement);
        if (response.status === 201) {
          this.domElement.getElementsByClassName(styles.successIndicator)[0]
            .innerHTML = "<i class='ms-Icon ms-Icon--Accept' aria-hidden='true'>&nbsp;Thank you for the feedback!</i>";
        } else {
          this.context.statusRenderer.renderError(this.domElement,
            `Failed to save feedback. Error code: ${response.statusText} (${response.status})`);
        }
      });
  } 

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.HintTextFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
