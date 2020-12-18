// Since we are using @import inside our css 
// That imported css get loaded after main.css get loaded and after the document get loaded

const rootStyles = window.getComputedStyle(document.documentElement); // To check when css files get loaded

if (rootStyles.getPropertyValue('--book-cover-width-large') != null) {
    ready()
} else {
    document.getElementById('main-css').addEventListener('load', ready) ;
}

function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'));     // parseFloat: To convert the output from String to Float
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'));
    const coverHeight = coverWidth / coverAspectRatio ;

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    );
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio ,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight,
    });
    
    FilePond.parse(document.body);
    console.log('file Upload is working !');
}

