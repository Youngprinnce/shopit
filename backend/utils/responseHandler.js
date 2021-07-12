const sendSuccess = (response, data = {}, message = '', code = 200) => {
    const resp = {
      success: true,
      message,
      data,
    };
    return response.status(code).json(resp);
  };
  
  const sendError = (response, error) => {
    const resp = {
      status: 'error',
      err: error.message,
    };
    return response.status(error.code || 400).json(resp);
  };
  
  module.exports = { sendSuccess, sendError };