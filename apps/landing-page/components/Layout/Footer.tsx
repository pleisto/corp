import * as Root from './style/footer.style'

export const Footer = () => {
  return (
    <Root.Footer>
      <Root.Content>
        <Root.Col
          css={{
            width: 250,
            paddingRight: 27,
            '@xsDown': {
              width: '100%'
            }
          }}
        >
          <Root.Information>Brickdoc Is the New Electricity to Power Your Thinking</Root.Information>
          <Root.Copy>
            Copyright © 2021 Brickdoc Inc. All rights reserved.
            <br />
            Made on Earth by humans.
          </Root.Copy>
        </Root.Col>

        <Root.Col css={{}}>
          <Root.List>
            <Root.Title>The Product</Root.Title>
            <Root.Item>
              <Root.Arrow />
              Why People Love Brickdoc
            </Root.Item>
          </Root.List>
          <Root.List>
            <Root.Title>ABOUT US</Root.Title>
            <Root.Item>
              <Root.Arrow />
              Our Promise
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Terms & Conditions
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Privacy Policy
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Frequently Asked Questions
            </Root.Item>
          </Root.List>
        </Root.Col>

        <Root.Col>
          <Root.List>
            <Root.Title>Help</Root.Title>
            <Root.Item>
              <Root.Arrow />
              Sign In
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Create a New Account
            </Root.Item>
          </Root.List>
          <Root.List
            css={{
              '@mdOnly': {
                display: 'block'
              },
              '@mdUp': {
                display: 'none'
              },
              '@xsDown': {
                display: 'none'
              }
            }}
          >
            <Root.Title>Contact Us</Root.Title>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Producthunt
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Twitter
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Github
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Report a Bug/Give Us Feedback
            </Root.Item>
          </Root.List>
        </Root.Col>

        <Root.Col
          css={{
            width: 273,
            '@mdOnly': {
              display: 'none'
            },
            '@mdUp': {
              display: 'block'
            }
          }}
        >
          <Root.List>
            <Root.Title>Contact Us</Root.Title>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Producthunt
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Twitter
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Brickdoc on Github
            </Root.Item>
            <Root.Item>
              <Root.Arrow />
              Report a Bug/Give Us Feedback
            </Root.Item>
          </Root.List>
        </Root.Col>
      </Root.Content>
    </Root.Footer>
  )
}
