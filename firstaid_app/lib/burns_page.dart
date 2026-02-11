import 'package:flutter/material.dart';

class BurnsPage extends StatelessWidget {
  const BurnsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.redAccent,
        title: const Text(
          'Burns First Aid',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView( // 📱 makes page scrollable
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 🔥 Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.local_fire_department,
                        color: Colors.red, size: 40),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'First Aid for Burns',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              buildStep(
                'Cool the burn under running water for 10 minutes',
                Icons.water_drop,
                Colors.blue,
              ),
              buildStep(
                'Do NOT apply ice directly',
                Icons.block,
                Colors.orange,
              ),
              buildStep(
                'Remove tight items like rings',
                Icons.remove_circle_outline,
                Colors.purple,
              ),
              buildStep(
                'Cover with a clean, non-stick cloth',
                Icons.medical_services,
                Colors.green,
              ),
              buildStep(
                'See a doctor for severe burns',
                Icons.local_hospital,
                Colors.red,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 🎨 Reusable styled step card
  Widget buildStep(String text, IconData icon, Color color) {
    return Card(
      elevation: 3,
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(
                  fontSize: 16,
                  height: 1.4,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
