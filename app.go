package main

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

//go:embed pocketbase.exe
var executableData []byte

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	go a.startPocketbase()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) startPocketbase() {
	// Create a temporary directory to store the embedded executable
	tempDir := os.TempDir()
	executablePath := filepath.Join(tempDir, "pocketbase.exe")

	fmt.Println("Executable file path:", executablePath)

	// Write the executable data to the file
	err := os.WriteFile(executablePath, executableData, 0700)
	if err != nil {
		fmt.Println("Error writing executable data to file:", err)
		return
	}
	defer os.Remove(executablePath)

	if _, err := os.Stat(executablePath); os.IsNotExist(err) {
		fmt.Println("Executable file does not exist")
		return
	}

	// Execute the embedded executable
	cmd := exec.Command(executablePath, "serve")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error executing embedded executable:", err)
		return
	}
}
