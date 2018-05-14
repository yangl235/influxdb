import React, {SFC} from 'react'
import HandlerInput from 'src/kapacitor/components/HandlerInput'
import HandlerEmpty from 'src/kapacitor/components/HandlerEmpty'

interface Props {
  selectedHandler: {
    enabled: boolean
  }
  handleModifyHandler: () => void
  onGoToConfig: () => void
  validationError: string
}

const Pagerduty2Handler: SFC<Props> = ({
  selectedHandler,
  handleModifyHandler,
  onGoToConfig,
  validationError,
}) =>
  selectedHandler.enabled ? (
    <div className="endpoint-tab-contents">
      <div className="endpoint-tab--parameters">
        <h4 className="u-flex u-jc-space-between">
          Parameters from Kapacitor Configuration
          <div className="btn btn-default btn-sm" onClick={onGoToConfig}>
            <span className="icon cog-thick" />
            {validationError
              ? 'Exit this Rule and Edit Configuration'
              : 'Save this Rule and Edit Configuration'}
          </div>
        </h4>
        <HandlerInput
          selectedHandler={selectedHandler}
          handleModifyHandler={handleModifyHandler}
          fieldName="routingKey"
          fieldDisplay="Routing Key:"
          placeholder="ex: routing_key"
          redacted={true}
          fieldColumns="col-md-12"
        />
      </div>
    </div>
  ) : (
    <HandlerEmpty
      onGoToConfig={onGoToConfig}
      validationError={validationError}
    />
  )

export default Pagerduty2Handler
