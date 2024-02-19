import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#e4e4f2",
            contrastText: "#FFFFFF"
        },
        secondary: {
            main: "#c4c9d6",
            contrastText: "#FFFFFF"
        },
        background: {
            default: "#c4c5d6"
        },
        type: "dark"
    }
});

const App = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            {props.children}

        </ThemeProvider>
    );
}

export default App;