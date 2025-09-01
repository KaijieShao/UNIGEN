import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Test component that mirrors the toggle functionality from MainContent
function TestToggleComponent() {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <div data-testid="test-toggle">
      <Tabs
        value={activeView}
        onValueChange={(v) => {
          if (v === "preview" || v === "code") {
            setActiveView(v);
          } else {
            console.warn("Invalid tab value:", v);
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="preview" data-testid="preview-tab">Preview</TabsTrigger>
          <TabsTrigger value="code" data-testid="code-tab">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <div data-testid="active-view">{activeView}</div>
    </div>
  );
}

describe('Toggle Functionality', () => {
  it('should start with preview as default', () => {
    render(<TestToggleComponent />);
    expect(screen.getByTestId('active-view')).toHaveTextContent('preview');
  });

  it('should toggle from preview to code when code tab is clicked', () => {
    render(<TestToggleComponent />);
    
    fireEvent.click(screen.getByTestId('code-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('code');
  });

  it('should toggle from code back to preview when preview tab is clicked', () => {
    render(<TestToggleComponent />);
    
    // First click code tab
    fireEvent.click(screen.getByTestId('code-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('code');
    
    // Then click preview tab
    fireEvent.click(screen.getByTestId('preview-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('preview');
  });

  it('should handle multiple toggles correctly', () => {
    render(<TestToggleComponent />);
    
    // Start: preview
    expect(screen.getByTestId('active-view')).toHaveTextContent('preview');
    
    // Click code
    fireEvent.click(screen.getByTestId('code-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('code');
    
    // Click preview
    fireEvent.click(screen.getByTestId('preview-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('preview');
    
    // Click code again
    fireEvent.click(screen.getByTestId('code-tab'));
    expect(screen.getByTestId('active-view')).toHaveTextContent('code');
  });
});