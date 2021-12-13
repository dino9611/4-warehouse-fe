<div className="container regis-container">
  <div className="regis-page d-flex ">
    <div className="gambar ">
      <img src={gambar} width="100%" height="100%" />
      {/* <h1>gambar</h1> */}
    </div>
    <div className="regis-form">
      <div className="regis-text">
        <h2>Register</h2>
      </div>
      <div className=" input-login d-flex flex-column">
        <div className="input">
          <TextField
            fullWidth
            value={username}
            id="outlined-basic"
            label="Username"
            onChange={this.onInputChange}
            name="username"
            type="text"
            variant="outlined"
            // className="input"
            color="warning"
          />
        </div>
        <div className="input">
          <TextField
            fullWidth
            value={email}
            id="outlined-basic"
            label="Email"
            onChange={this.onInputChange}
            name="email"
            type="email"
            variant="outlined"
            // className="input"
            color="warning"
          />
        </div>
        <div className="input">
          <TextField
            fullWidth
            value={password}
            id="outlined-password-input"
            label="Password"
            name="password"
            onChange={this.onInputChange}
            type={showpassword}
            autoComplete="current-password"
            className="input-field"
            color="warning"
          />
        </div>
        <div className="input">
          <TextField
            fullWidth
            value={confirm_password}
            id="outlined-password-input"
            label=" Confirm Password"
            name="confirm_password"
            onChange={this.onInputChange}
            type={showpassword}
            autoComplete="current-password"
            className="input-field"
            color="warning"
          />
        </div>
        <div className="mt-2 checkbox d-flex">
          <input
            type="checkbox"
            className="checkbox-input"
            onChange={this.onCheckShow}
          />
          <h6 className="showpassword">Show Password</h6>
        </div>
        <div>
          <button className="regis-button rounded " onClick={this.onRegisClick}>
            Register
          </button>
        </div>

        <div className="d-flex login-here">
          <h6 className="pt-1">Already Have an Account?</h6>
          <Link className="link" to="/login">
            Login Here!
          </Link>
        </div>
      </div>
    </div>
  </div>
  <SuccessSnack
    message={this.state.message}
    successSnack={this.state.successSnack}
    handleClose={this.handleClose}
  />
  <ErrorSnack
    message={this.state.message}
    errorSnack={this.state.errorSnack}
    handleClose={this.handleClose}
  />
</div>;
