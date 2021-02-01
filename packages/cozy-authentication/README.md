[Cozy] Authentication component
==================

What's cozy-authentication?
----------------

Cozy-Authentication is a React component used to authenticate to a Cozy when targeting a Cordova Application (if you are targeting a web application, no need to use this component since the cozy-stack (server) will serve you the login page). It acts as a login page.

Its key's features: 
- Select Server page
- Handle OAuth login 
- Handle Deeplink (custom schema or universal link)
- Generation of a specific link to the cozy's manager to create a cozy and make the auto-login
- Based on Cozy-client 

How to use it?
----------------

```jsx
import { MobileRouter } from 'cozy-authentication'
import { hashHistory, Route } from 'react-router'

import {useClient} from 'cozy-client'

const LoginPage = () => {
    // LoginPage has to be a child of a CozyProvider from cozy-client
    const client = useClient()
    // client will have isLogged === false at first
    return <MobileRouter
          protocol={'mycustomSchema://'}
          appTitle={'My App Name'}
          universalLinkDomain={'https://links.mycozy.cloud'}
          appSlug={'appname'}
          history={hashHistory}
          onAuthenticated={() => {
              alert('user Authenticated')
              console.log({client}) // client is logged
          }}
          loginPath={'/path/after/successfullLogin'}
          onLogout={() => alert('logout')}
          appIcon={require('icon.png')}
        >
            <Route>
                <Route path="path1" component={...} />
                <Route path="path2" component={...} />
            </Route>
        </MobileRouter>
}
```

Check MobileRouter.propTypes, to see the full list of options

Also take a look to our playground lib to have an exemple: https://github.com/cozy/cozy-libs/blob/master/packages/playgrounds/src/common/App.jsx#L59

What's Cozy?
------------

![Cozy Logo](https://cdn.rawgit.com/cozy/cozy-guidelines/master/templates/cozy_logo_small.svg)

[Cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

Contribute
----------

If you want to work on cozy-authentication itself and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about this repository structure, testing, linting and how to properly open pull-requests.

Community
---------

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]


Licence
-------

cozy-authentication is developed by Cozy Cloud and distributed under the [MIT].


[cozy]: https://cozy.io "Cozy Cloud"
[MIT]: https://opensource.org/licenses/MIT
[contribute]: CONTRIBUTING.md
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/mycozycloud
