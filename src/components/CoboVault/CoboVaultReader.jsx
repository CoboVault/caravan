import React, { Component } from "react";
import PropTypes from "prop-types";
import { PENDING, ACTIVE } from "unchained-wallets";
import "./styles.css";

import { Button, FormHelperText, Grid } from "@material-ui/core";

import CoboVaultRawReader from "./CoboVaultRawReader";

class CoboVaultReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: PENDING,
      error: "",
    };
  }

  render = () => {
    const { status, error } = this.state;
    const {
      interaction,
      qrStartText,
      fileStartText,
      shouldShowFileReader,
      fileType,
    } = this.props;

    if (status === PENDING) {
      const commandMessage = interaction.messageFor({
        state: status,
        code: "cobo.command",
      });
      return (
        <div>
          <p>{commandMessage.instructions}</p>
          <p>
            When you are ready, scan the QR code produced by Cobo Vault or
            upload the file generated by Cobo Vault:
          </p>
          <Grid container spacing={2}>
            <CoboVaultRawReader
              shouldShowFileReader={shouldShowFileReader}
              fileStartText={fileStartText}
              qrStartText={qrStartText}
              interaction={interaction}
              handleError={this.handleError}
              handleSuccess={this.handleSuccess}
              handleStop={this.handleStop}
              fileType={fileType}
            />
          </Grid>
        </div>
      );
    }

    if (status === "error" || status === "success") {
      return (
        <div>
          <FormHelperText error>{error}</FormHelperText>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={this.handleStop}
          >
            Reset
          </Button>
        </div>
      );
    }

    return null;
  };

  handleStart = () => {
    const { onStart } = this.props;
    this.setState({ status: ACTIVE, error: "" });
    if (onStart) {
      onStart();
    }
  };

  handleError = (error) => {
    const { onClear } = this.props;
    this.setState({ status: "error", error: error.message });
    if (onClear) {
      onClear();
    }
  };

  handleSuccess = (result) => {
    const { onSuccess } = this.props;
    onSuccess(result);
    this.setState({ status: "success" });
  };

  handleStop = () => {
    const { onClear } = this.props;
    this.setState({
      status: PENDING,
      error: "",
    });
    if (onClear) {
      onClear();
    }
  };
}

CoboVaultReader.propTypes = {
  onStart: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  qrStartText: PropTypes.string,
  shouldShowFileReader: PropTypes.bool.isRequired,
  fileStartText: PropTypes.string,
  interaction: PropTypes.shape({
    messageFor: PropTypes.func,
    parse: PropTypes.func,
  }).isRequired,
  fileType: PropTypes.string,
};

CoboVaultReader.defaultProps = {
  qrStartText: "",
  fileStartText: "",
  fileType: "json",
};

export default CoboVaultReader;
