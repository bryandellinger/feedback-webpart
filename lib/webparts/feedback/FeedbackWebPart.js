var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './FeedbackWebPart.module.scss';
import * as strings from 'FeedbackWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
var FeedbackWebPart = /** @class */ (function (_super) {
    __extends(FeedbackWebPart, _super);
    function FeedbackWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FeedbackWebPart.prototype.render = function () {
        debugger;
        this.domElement.innerHTML = "\n    <div>\n    <i class='ms-Icon ms-Icon--NoteForward' aria-hidden='true'></i>\n    <input type='text' class='" + styles.input + "' maxlenght='255' placeholder='" + escape(this.properties.hintText) + "' />\n    <button type='button' class='ms-Button'><span class='ms-Button-label'>Send</span></button>\n    <p class='" + styles.successIndicator + "'></p>\n  </div>";
        this.setComment = this.setComment.bind(this);
        this.sendFeedback = this.sendFeedback.bind(this);
        var textInput = this.domElement.getElementsByTagName("INPUT")[0];
        textInput.addEventListener("keyup", this.setComment);
        var button = this.domElement.getElementsByTagName("BUTTON")[0];
        button.onclick = this.sendFeedback;
        button.disabled = true;
    };
    FeedbackWebPart.prototype.setComment = function (event) {
        debugger;
        var srcElement = event.srcElement;
        this._commentText = escape(srcElement.value);
        var button = this.domElement.getElementsByTagName("BUTTON")[0];
        button.disabled = (this._commentText.length === 0);
    };
    FeedbackWebPart.prototype.sendFeedback = function () {
        var _this = this;
        this.context.statusRenderer.clearError(this.domElement);
        var paragraphElement = this.domElement.getElementsByClassName(styles.successIndicator)[0];
        paragraphElement.innerHTML = "";
        if (this._commentText === undefined || this._commentText.length === 0) {
            this.context.statusRenderer.renderError(this.domElement, "Please type in a comment or suggestion.");
            return;
        }
        if (Environment.type === EnvironmentType.Local) {
            this.context.statusRenderer.renderError(this.domElement, "Feedback can't be saved when running in local workbech.");
            return;
        }
        var url = this.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Feedback')/items";
        var item = {
            "Title": this._commentText,
            "url": window.location.href
        };
        var spHttpClientOptions = {
            "body": JSON.stringify(item)
        };
        this.context.statusRenderer.displayLoadingIndicator(paragraphElement, "- Sending feedback");
        this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
            .then(function (response) {
            _this.context.statusRenderer.clearLoadingIndicator(paragraphElement);
            if (response.status === 201) {
                _this.domElement.getElementsByClassName(styles.successIndicator)[0]
                    .innerHTML = "<i class='ms-Icon ms-Icon--Accept' aria-hidden='true'>&nbsp;Thank you for the feedback!</i>";
            }
            else {
                _this.context.statusRenderer.renderError(_this.domElement, "Failed to save feedback. Error code: " + response.statusText + " (" + response.status + ")");
            }
        });
    };
    Object.defineProperty(FeedbackWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    FeedbackWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    };
    return FeedbackWebPart;
}(BaseClientSideWebPart));
export default FeedbackWebPart;
//# sourceMappingURL=FeedbackWebPart.js.map