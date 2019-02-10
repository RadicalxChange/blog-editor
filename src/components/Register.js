import React from "react";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Register extends React.Component {
  state = {};

  handleChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState({
      [id]: value
    });
  };

  render() {
    if (this.props.registerSuccess) {
      return <Redirect push to="/" />;
    }
    return (
      <div>
        <Form
          style={{ margin: "15vh auto 0", width: "90%", maxWidth: "250px" }}
          onSubmit={e => this.props.register(e, this.state)}
        >
          <Form.Group controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
          </Form.Group>

          <Button
            block
            variant="primary"
            type="submit"
            style={{ marginTop: "2em" }}
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default Register;
