/*
 * This is a sample page that can be accessed at /hello
 * It is used by e2e tests to verify that the app is running since all other routes are authenticated using middleware
 */
const Hello = () => {
  return <pre className='p-1'>Hello, World!</pre>
}

export default Hello
