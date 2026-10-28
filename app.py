"""Sort students by marks using Bubble Sort (highest marks first)."""


def bubble_sort_students(students):
    """Sort a list of student dictionaries in descending order of marks."""
    number_of_students = len(students)

    # Each pass moves the lowest remaining mark toward the end of the list.
    for pass_number in range(number_of_students - 1):
        swapped = False

        for index in range(number_of_students - 1 - pass_number):
            if students[index]["marks"] < students[index + 1]["marks"]:
                students[index], students[index + 1] = (
                    students[index + 1],
                    students[index],
                )
                swapped = True

        # If no pair was swapped, the list is already sorted.
        if not swapped:
            break


def get_positive_integer(prompt):
    """Ask for a positive whole number and repeat until one is entered."""
    while True:
        try:
            value = int(input(prompt))
            if value > 0:
                return value
            print("Please enter a number greater than 0.")
        except ValueError:
            print("Please enter a valid whole number.")


def get_student_marks(prompt):
    """Ask for an integer mark from 0 to 100."""
    while True:
        try:
            marks = int(input(prompt))
            if 0 <= marks <= 100:
                return marks
            print("Marks must be between 0 and 100.")
        except ValueError:
            print("Please enter marks as a whole number.")


def main():
    print("Student Marks Sorting System")
    print("----------------------------")

    number_of_students = get_positive_integer("Enter the number of students: ")
    students = []

    for student_number in range(1, number_of_students + 1):
        print(f"\nStudent {student_number}")

        while True:
            name = input("Enter student name: ").strip()
            if name:
                break
            print("Name cannot be empty.")

        marks = get_student_marks("Enter marks (0-100): ")
        students.append({"name": name, "marks": marks})

    bubble_sort_students(students)

    print("\nStudents sorted by marks (highest to lowest):")
    print("----------------------------------------------")
    print(f"{'Rank':<8}{'Name':<20}{'Marks':>5}")
    print("-" * 33)

    for rank, student in enumerate(students, start=1):
        print(f"{rank:<8}{student['name']:<20}{student['marks']:>5}")


if __name__ == "__main__":
    main()
