# yupee-dialogs
This is simple inner dialogs for the yupee framework

You have 3 dialogs usage :

```javascript
$$.dialogs.alert
$$.dialogs.prompt
$$.dialogs.confirm
```

Each dialog is asynchronous for general usage like electron usage. Here a very simple case for a prompt value.

```javascript
async myPrompt() {
    const news = await $$.dialogs.prompt( "What's new ?" );
    console.log( news );
}
```

You have two dialogs types :

## Native dialogs

This is the default dialogs for Yupee. You just have to put the yupee-dialogs1.js after the yupee.js library.

```html
<!DOCTYPE html>
<html>
    <head>
        <script src='yupee.js'></script>
        <script src='yupee-dialogs1.js'></script>
    </head>
    ...
</html>
```

## Inner dialogs

This is inner dialogs for Yupee. You just have to put the yupee-dialogs2.js after the yupee.js library.

This is very useful for electron usage.

```html
<!DOCTYPE html>
<html>
    <head>
        <script src='yupee.js'></script>
        <script src='yupee-dialogs2.js'></script>
    </head>
    ...
</html>
```
