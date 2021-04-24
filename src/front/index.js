module.exports = path => {
    

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script type="javascript">
        const ipc = require('electron').ipcRenderer;
        ipc.send('hello','a string', 10);
        var electron = require('electron');
    
    </script>
</body>
</html>
        
    `;
}