import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
export interface IFeedbackWebPartProps {
    hintText: string;
}
export default class FeedbackWebPart extends BaseClientSideWebPart<IFeedbackWebPartProps> {
    render(): void;
    private _commentText;
    private setComment;
    private sendFeedback;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=FeedbackWebPart.d.ts.map