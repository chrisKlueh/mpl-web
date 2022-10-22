export const getErrorDialogTitle = (errorName) => {
  switch (errorName) {
    case "timeout_error":
      return "Connection Timeout";
    case "peer_connection_error":
      return "Peer Connection Lost";
    case "demo_error":
      return "Instance Error";
    default:
      return "Error";
  }
};

export const getErrorDialogChildrenConfig = (errorName) => {
  switch (errorName) {
    case "timeout_error":
      return {
        description: "A timeout occurred when establishing the peer connection",
        consequence: "Try to spawn a new instance of this demo.",
      };
    case "peer_connection_error":
      return {
        description: "The peer connection to your instance was lost",
        consequence: "Try to spawn a new instance of this demo.",
      };
    case "demo_error":
      return {
        description: "Your demo instance encountered an internal error",
        additionalDescription: "The instance might not work properly anymore.",
        additionalAdminDescription:
          "The exception's traceback will be printed to your console.",
        consequence: "Do you want to terminate it now?",
      };
    case "user_error":
      return {
        description:
          "You cannot access an instance via URL or refresh your current tab",
        consequence: "Try to spawn a new instance of this demo.",
      };
    default:
      return {
        description: "Looks like an error occurred",
        consequence: "Try to spawn a new instance of this demo.",
      };
  }
};

export const isBugreportAllowed = (errorName) => {
  switch (errorName) {
    case "timeout_error":
      return true;
    case "peer_connection_error":
      return true;
    case "demo_error":
      return true;
    default:
      return false;
  }
};
