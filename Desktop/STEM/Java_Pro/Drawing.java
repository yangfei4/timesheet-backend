import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;

public class Drawing extends JFrame {
    private JPanel canvas;
    private List<Rectangle> rectangles;
    private Rectangle currentRectangle;

    public Drawing() {
        // Set up the JFrame
        setTitle("Drawing Example");
        setSize(400, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Initialize rectangles list
        rectangles = new ArrayList<>();

        // Create a JPanel for drawing
        canvas = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                for (Rectangle rectangle : rectangles) {
                    g.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
                }
                if (currentRectangle != null) {
                    g.drawRect(currentRectangle.x, currentRectangle.y, currentRectangle.width, currentRectangle.height);
                }
            }
        };

        // Add mouse listener for interaction
        canvas.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                currentRectangle = new Rectangle(e.getX(), e.getY(), 0, 0);
                repaint();
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                rectangles.add(currentRectangle);
                currentRectangle = null;
                repaint();
            }
        });

        // Add mouse motion listener for tracking drag
        canvas.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                if (currentRectangle != null) {
                    currentRectangle.width = e.getX() - currentRectangle.x;
                    currentRectangle.height = e.getY() - currentRectangle.y;
                    repaint();
                }
            }
        });

        // Add the JPanel to the JFrame
        add(canvas);

        // Make the JFrame visible
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Drawing::new);
    }
}
