import signin from './user/signin.test'
import signup from './user/signup.test'
import record from './running/record.test'
import list from './running/list.test'
import picture from './picture/picture.test'

(async () => {
    await signin()
    await signup()
    await record()
    await list()
    await picture()
})()
